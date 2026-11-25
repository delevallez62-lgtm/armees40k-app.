package com.armees40k.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageInstaller;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.app.PendingIntent;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;

/** Mise à jour de l'application elle-même : détecte un nouvel APK, le télécharge, puis lance l'installation (confirmation Android obligatoire). */
class ApkUpdater {
    static final String VERSION_URL = "https://raw.githubusercontent.com/delevallez62-lgtm/armees40k-app./apk/version.json";
    private static final String ACTION = "com.armees40k.app.INSTALL_RESULT";
    private final Activity act;
    private final SharedPreferences prefs;
    private volatile boolean busy;
    private int vCode; private String vName, url, notes; private long size;
    private File apk;

    ApkUpdater(Activity a, SharedPreferences p) { act = a; prefs = p; }

    int currentCode() {
        try { return act.getPackageManager().getPackageInfo(act.getPackageName(), 0).versionCode; } catch (Exception e) { return 0; }
    }
    String currentName() {
        try { return act.getPackageManager().getPackageInfo(act.getPackageName(), 0).versionName; } catch (Exception e) { return "?"; }
    }

    private File dir() { File d = new File(act.getCacheDir(), "apk"); d.mkdirs(); return d; }

    /** Vérifie (au plus toutes les 3 h sauf force) puis télécharge et propose l'installation. */
    void check(final boolean force) {
        if (busy) return;
        long now = System.currentTimeMillis();
        if (!force && now - prefs.getLong("apk_chk", 0) < 3L * 3600 * 1000) { resumePending(); return; }
        busy = true;
        new Thread(() -> {
            try {
                HttpURLConnection c = (HttpURLConnection) new URL(VERSION_URL + "?t=" + now).openConnection();
                c.setConnectTimeout(5000); c.setReadTimeout(8000); c.setRequestProperty("Cache-Control", "no-cache");
                if (c.getResponseCode() != 200) throw new Exception("http " + c.getResponseCode());
                StringBuilder sb = new StringBuilder();
                try (InputStream in = c.getInputStream()) { byte[] b = new byte[4096]; int n; while ((n = in.read(b)) > 0) sb.append(new String(b, 0, n, "UTF-8")); }
                JSONObject j = new JSONObject(sb.toString());
                vCode = j.getInt("versionCode"); vName = j.optString("versionName", "?"); url = j.getString("url");
                notes = j.optString("notes", ""); size = j.optLong("size", 0);
                prefs.edit().putLong("apk_chk", now).apply();
                if (vCode <= currentCode()) { cleanup(); if (force) toast("Application à jour (version " + currentName() + ")"); return; }
                apk = new File(dir(), "update-" + vCode + ".apk");
                if (!apk.exists() || (size > 0 && apk.length() != size)) {
                    toast("⬇ Nouvelle version " + vName + " : téléchargement…");
                    File tmp = new File(dir(), "update-" + vCode + ".part");
                    HttpURLConnection d = (HttpURLConnection) new URL(url).openConnection();
                    d.setConnectTimeout(8000); d.setReadTimeout(30000);
                    if (d.getResponseCode() != 200) throw new Exception("dl " + d.getResponseCode());
                    try (InputStream in = d.getInputStream(); OutputStream out = new FileOutputStream(tmp)) {
                        byte[] b = new byte[32768]; int n; while ((n = in.read(b)) > 0) out.write(b, 0, n);
                    }
                    if (size > 0 && tmp.length() != size) { tmp.delete(); throw new Exception("taille"); }
                    if (!tmp.renameTo(apk)) throw new Exception("rename");
                }
                act.runOnUiThread(this::propose);
            } catch (Exception e) {
                if (force) toast("Vérification impossible (pas de connexion ?)");
            } finally { busy = false; }
        }).start();
    }

    /** Un APK déjà téléchargé et plus récent que l'installé : on le propose de nouveau. */
    private void resumePending() {
        try {
            File[] fs = dir().listFiles();
            if (fs == null) return;
            int best = 0; File bf = null;
            for (File f : fs) {
                String n = f.getName();
                if (n.startsWith("update-") && n.endsWith(".apk")) {
                    int v = Integer.parseInt(n.substring(7, n.length() - 4));
                    if (v > currentCode() && v > best) { best = v; bf = f; }
                }
            }
            if (bf != null) { apk = bf; vCode = best; vName = prefs.getString("apk_name", "nouvelle"); notes = prefs.getString("apk_notes", ""); propose(); }
        } catch (Exception ignored) {}
    }

    private void cleanup() { File[] fs = dir().listFiles(); if (fs != null) for (File f : fs) f.delete(); }

    private void toast(final String s) { act.runOnUiThread(() -> Toast.makeText(act, s, Toast.LENGTH_LONG).show()); }

    private boolean shown;
    private void propose() {
        if (shown || act.isFinishing()) return;
        shown = true;
        prefs.edit().putString("apk_name", vName).putString("apk_notes", notes).apply();
        String msg = "La version " + vName + " de l'application est prête (installée : " + currentName() + ").\n\n"
            + (notes.length() > 0 ? notes + "\n\n" : "")
            + "Tes armées et tes notes sont conservées. Android va te demander de confirmer l'installation.";
        new AlertDialog.Builder(act).setTitle("Nouvelle version disponible").setMessage(msg)
            .setPositiveButton("Installer maintenant", (d, w) -> { shown = false; install(); })
            .setNegativeButton("Plus tard", (d, w) -> shown = false)
            .setOnCancelListener(d -> shown = false).show();
    }

    private void install() {
        if (Build.VERSION.SDK_INT >= 26 && !act.getPackageManager().canRequestPackageInstalls()) {
            Toast.makeText(act, "Autorise « Mes armées 40k » à installer des applications, puis reviens ici.", Toast.LENGTH_LONG).show();
            prefs.edit().putBoolean("apk_wait_perm", true).apply();
            act.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + act.getPackageName())));
            return;
        }
        try {
            final PackageInstaller pi = act.getPackageManager().getPackageInstaller();
            PackageInstaller.SessionParams p = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
            final int id = pi.createSession(p);
            PackageInstaller.Session s = pi.openSession(id);
            try (InputStream in = new FileInputStream(apk); OutputStream out = s.openWrite("update", 0, apk.length())) {
                byte[] b = new byte[32768]; int n; while ((n = in.read(b)) > 0) out.write(b, 0, n); s.fsync(out);
            }
            BroadcastReceiver r = new BroadcastReceiver() {
                @Override public void onReceive(Context c, Intent i) {
                    int st = i.getIntExtra(PackageInstaller.EXTRA_STATUS, -1);
                    if (st == PackageInstaller.STATUS_PENDING_USER_ACTION) {
                        Intent conf = (Intent) i.getParcelableExtra(Intent.EXTRA_INTENT);
                        if (conf != null) { conf.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); c.startActivity(conf); }
                    } else if (st != PackageInstaller.STATUS_SUCCESS) {
                        Toast.makeText(c, "Installation non terminée : " + i.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE), Toast.LENGTH_LONG).show();
                        try { c.unregisterReceiver(this); } catch (Exception ignored) {}
                    }
                }
            };
            if (Build.VERSION.SDK_INT >= 33) act.registerReceiver(r, new IntentFilter(ACTION), Context.RECEIVER_NOT_EXPORTED);
            else act.registerReceiver(r, new IntentFilter(ACTION));
            Intent it = new Intent(ACTION).setPackage(act.getPackageName());
            int fl = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
            s.commit(PendingIntent.getBroadcast(act, id, it, fl).getIntentSender());
            s.close();
        } catch (Exception e) {
            Toast.makeText(act, "Impossible de lancer l'installation : " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    /** Appelé au retour dans l'appli : si l'utilisateur vient d'autoriser les sources, on reprend. */
    void onResume() {
        if (prefs.getBoolean("apk_wait_perm", false) && Build.VERSION.SDK_INT >= 26 && act.getPackageManager().canRequestPackageInstalls()) {
            prefs.edit().putBoolean("apk_wait_perm", false).apply();
            if (apk != null && apk.exists()) { install(); return; }
        }
        check(false);
    }
}
