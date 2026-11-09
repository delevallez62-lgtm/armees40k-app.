package com.armees40k.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.webkit.CookieManager;
import android.webkit.WebResourceError;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import org.json.JSONObject;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String HOST = "app.armees40k.local";
    private static final String START = "https://" + HOST + "/index.html";
    private static final int REQ_FILE = 1, REQ_SAVE = 2;
    /** Adresse de mise à jour par défaut (modifiable dans l'app). */
    private static final String DEFAULT_UPDATE_URL = "https://raw.githubusercontent.com/delevallez62-lgtm/armees40k-app./main/index.html";
    /** Ta page sur Claude : toujours la dernière version, données synchronisées avec ton compte. */
    private static final String ONLINE = "https://claude.ai/artifact/WSNePThxfvBfXjNFPHaaQw";
    private SharedPreferences prefs;
    private boolean offlineShown;

    private WebView web;
    private ValueCallback<Uri[]> fileCb;
    private String pendingSave;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setBackgroundColor(0xFF0d1511);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        prefs = getSharedPreferences("a40k", MODE_PRIVATE);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, true);
        web.addJavascriptInterface(new Bridge(), "Android");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (!HOST.equals(u.getHost())) return null;
                String path = u.getPath();
                if (path == null || path.equals("/")) path = "/index.html";
                try {
                    File upd = new File(getFilesDir(), "index.html");
                    InputStream in = path.equals("/index.html") && upd.exists()
                        ? new FileInputStream(upd) : getAssets().open(path.substring(1));
                    WebResourceResponse res = new WebResourceResponse(mime(path), "utf-8", in);
                    Map<String, String> h = new HashMap<>();
                    h.put("Access-Control-Allow-Origin", "*");
                    h.put("Cache-Control", "no-cache");
                    res.setResponseHeaders(h);
                    return res;
                } catch (Exception e) {
                    return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", null, null);
                }
            }

            @Override
            public void onReceivedError(WebView v, WebResourceRequest r, WebResourceError e) {
                // Pas de connexion : on bascule sur la copie hors ligne.
                if (r.isForMainFrame() && !HOST.equals(r.getUrl().getHost())) openOffline(true);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                String h = u.getHost() == null ? "" : u.getHost();
                if (HOST.equals(h) || isClaude(h)) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) {}
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                Intent i;
                try { i = p.createIntent(); } catch (Exception e) { i = new Intent(Intent.ACTION_GET_CONTENT); i.setType("*/*"); }
                i.addCategory(Intent.CATEGORY_OPENABLE);
                try {
                    startActivityForResult(Intent.createChooser(i, null), REQ_FILE);
                } catch (ActivityNotFoundException e) {
                    fileCb = null;
                    return false;
                }
                return true;
            }
        });

        if (state != null) web.restoreState(state);
        else start();
    }

    private static boolean isClaude(String h) {
        return h.equals("claude.ai") || h.endsWith(".claude.ai") || h.equals("claude.com") || h.endsWith(".claude.com")
            || h.endsWith("anthropic.com") || h.endsWith("claudeusercontent.com");
    }

    private boolean online() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
            NetworkCapabilities c = cm.getNetworkCapabilities(cm.getActiveNetwork());
            return c != null && c.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
        } catch (Exception e) { return true; }
    }

    private void start() {
        if (prefs.getBoolean("sync", false) && online()) { offlineShown = false; web.loadUrl(ONLINE); }
        else openOffline(false);
    }

    private void openOffline(boolean noNet) {
        if (offlineShown) return;
        offlineShown = true;
        web.loadUrl(START);
        if (noNet) toast("Pas de connexion : version hors ligne (non synchronisée)");
    }

    private static String mime(String p) {
        if (p.endsWith(".html")) return "text/html";
        if (p.endsWith(".js") || p.endsWith(".mjs")) return "application/javascript";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".json")) return "application/json";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }

    class Bridge {
        @JavascriptInterface
        public String info() {
            try {
                File f = new File(getFilesDir(), "index.html");
                JSONObject o = new JSONObject();
                o.put("custom", f.exists());
                o.put("date", f.exists() ? new SimpleDateFormat("dd/MM/yyyy à HH:mm", Locale.FRANCE).format(new Date(f.lastModified())) : "");
                o.put("url", DEFAULT_UPDATE_URL);
                return o.toString();
            } catch (Exception e) { return "{}"; }
        }

        @JavascriptInterface
        public String installHtml(String html) { return install(html); }

        @JavascriptInterface
        public void goOnline() {
            runOnUiThread(() -> { prefs.edit().putBoolean("sync", true).apply(); start(); });
        }

        @JavascriptInterface
        public void stayOffline() { prefs.edit().putBoolean("sync", false).apply(); }

        @JavascriptInterface
        public boolean syncOn() { return prefs.getBoolean("sync", true); }

        @JavascriptInterface
        public void resetBuiltIn() { new File(getFilesDir(), "index.html").delete(); }

        @JavascriptInterface
        public void updateFromUrl(final String url) {
            new Thread(() -> {
                String msg; boolean ok = false;
                try {
                    String sep = url.contains("?") ? "&" : "?";
                    HttpURLConnection c = (HttpURLConnection) new URL(url + sep + "t=" + System.currentTimeMillis()).openConnection();
                    c.setConnectTimeout(15000); c.setReadTimeout(30000);
                    c.setRequestProperty("Cache-Control", "no-cache");
                    int code = c.getResponseCode();
                    if (code != 200) throw new Exception("le serveur a répondu " + code);
                    ByteArrayOutputStream b = new ByteArrayOutputStream();
                    try (InputStream in = c.getInputStream()) { byte[] buf = new byte[16384]; int n; while ((n = in.read(buf)) > 0) b.write(buf, 0, n); }
                    String r = install(new String(b.toByteArray(), StandardCharsets.UTF_8));
                    ok = "ok".equals(r);
                    msg = ok ? "Nouvelle version installée ! Redémarrage…" : "same".equals(r) ? "Tu as déjà la dernière version." : r;
                } catch (Exception e) { msg = "Échec du téléchargement : " + e.getMessage(); }
                final String m = JSONObject.quote(msg); final boolean k = ok;
                runOnUiThread(() -> web.evaluateJavascript("window.a40kUpd&&a40kUpd(" + k + "," + m + ")", null));
            }).start();
        }

        @JavascriptInterface
        public void saveFile(final String name, final String content) {
            runOnUiThread(() -> {
                pendingSave = content;
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType("application/json");
                i.putExtra(Intent.EXTRA_TITLE, name);
                try { startActivityForResult(i, REQ_SAVE); }
                catch (Exception e) { pendingSave = null; toast("Impossible d'ouvrir l'enregistrement de fichier"); }
            });
        }
    }

    /** Adapte une page « Mes armées 40k » venant de Claude puis l'installe à la place de la version embarquée. */
    private String install(String html) {
        try {
            if (html == null || html.length() < 1000) return "Fichier vide ou incomplet.";
            int a = html.indexOf("<!DOCTYPE html>");
            if (a > 0) { // page enveloppée par Claude : on garde le document intérieur
                html = html.substring(a);
                int last = html.lastIndexOf("</html>");
                int prev = last > 0 ? html.lastIndexOf("</html>", last - 1) : -1;
                if (prev > 0) html = html.substring(0, prev + 7);
            }
            if (!html.contains("armees40k") || !html.contains("<script")) return "Ce fichier n'est pas une version de Mes armées 40k.";
            html = html.replace("for(const b of[\"https://cdnjs", "for(const b of[\"lib/\",\"https://cdnjs");
            String extra;
            try (InputStream in = getAssets().open("app-extra.js")) {
                ByteArrayOutputStream b = new ByteArrayOutputStream(); byte[] buf = new byte[8192]; int n;
                while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
                extra = new String(b.toByteArray(), StandardCharsets.UTF_8);
            }
            int i = html.lastIndexOf("</body>");
            html = i >= 0 ? html.substring(0, i) + extra + html.substring(i) : html + extra;
            File cur = new File(getFilesDir(), "index.html");
            if (cur.exists() && cur.length() == html.getBytes(StandardCharsets.UTF_8).length) {
                try (InputStream in = new FileInputStream(cur)) {
                    ByteArrayOutputStream b = new ByteArrayOutputStream(); byte[] buf = new byte[16384]; int n;
                    while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
                    if (new String(b.toByteArray(), StandardCharsets.UTF_8).equals(html)) return "same";
                }
            }
            File tmp = new File(getFilesDir(), "index.tmp");
            try (FileOutputStream o = new FileOutputStream(tmp)) { o.write(html.getBytes(StandardCharsets.UTF_8)); }
            if (!tmp.renameTo(new File(getFilesDir(), "index.html"))) return "Impossible d'enregistrer la mise à jour.";
            return "ok";
        } catch (Exception e) { return "Erreur : " + e.getMessage(); }
    }

    private void toast(String m) { Toast.makeText(this, m, Toast.LENGTH_LONG).show(); }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        if (req == REQ_FILE) {
            if (fileCb != null) {
                Uri[] r = null;
                if (res == RESULT_OK && data != null) {
                    if (data.getClipData() != null) {
                        int n = data.getClipData().getItemCount();
                        r = new Uri[n];
                        for (int k = 0; k < n; k++) r[k] = data.getClipData().getItemAt(k).getUri();
                    } else if (data.getData() != null) r = new Uri[]{data.getData()};
                }
                fileCb.onReceiveValue(r);
                fileCb = null;
            }
        } else if (req == REQ_SAVE) {
            String c = pendingSave;
            pendingSave = null;
            if (res == RESULT_OK && data != null && data.getData() != null && c != null) {
                try (OutputStream o = getContentResolver().openOutputStream(data.getData(), "wt")) {
                    o.write(c.getBytes(StandardCharsets.UTF_8));
                    toast("Sauvegarde enregistrée");
                } catch (Exception e) { toast("Échec de l'enregistrement : " + e.getMessage()); }
            }
        } else super.onActivityResult(req, res, data);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        // Ferme d'abord une fenêtre ouverte dans l'app (Échap), sinon quitte.
        web.evaluateJavascript(
            "(function(){var o=document.querySelectorAll('.ov');if(o.length){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));" +
            "var l=document.querySelectorAll('.ov');if(l.length===o.length){var x=l[l.length-1].querySelector('.cx,[data-act=close],[data-x=c]');if(x)x.click();else l[l.length-1].remove();}return 1}var d=document.querySelector('#dzp.on');if(d){document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return 1}return 0})()",
            v -> { if (!"1".equals(v)) { if (web.canGoBack()) web.goBack(); else finish(); } });
    }

    @Override protected void onPause() { super.onPause(); web.onPause(); }
    @Override protected void onResume() { super.onResume(); web.onResume(); }
}
