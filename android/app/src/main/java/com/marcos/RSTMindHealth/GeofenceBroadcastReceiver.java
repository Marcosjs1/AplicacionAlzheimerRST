package com.marcos.RSTMindHealth;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingEvent;

import org.json.JSONObject;

import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class GeofenceBroadcastReceiver extends BroadcastReceiver {

    private static final String TAG = "GeofenceReceiver";
    // Using 10.0.2.2 for localhost emulator access, but usually Supabase is
    // external.
    // If using real device, need actual Supabase URL.
    // Assuming user uses cloud supabase or a reachable URL.
    // Since user didn't provide specific URL, I will need to use a placeholder or
    // assume common one.
    // For now, I'll assume they will replace it or I'll try to find it in .env, BUT
    // Java can't read .env easily.
    // I will pass the FUNCTION_URL from `start` method if I can, OR hardcode a
    // placeholder for now.
    // Let's improve the Plugin to save the URL too. Be safer.

    // Actually, I'll update the Plugin to save the URL. For now, writing this.

    @Override
    public void onReceive(Context context, Intent intent) {
        GeofencingEvent geofencingEvent = GeofencingEvent.fromIntent(intent);
        if (geofencingEvent.hasError()) {
            Log.e(TAG, "Geofence error: " + geofencingEvent.getErrorCode());
            return;
        }

        int geofenceTransition = geofencingEvent.getGeofenceTransition();

        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT) {
            Log.i(TAG, "Geofence EXIT detected");

            // Read Config
            SharedPreferences prefs = context.getSharedPreferences("GeofenceConfig", Context.MODE_PRIVATE);
            String token = prefs.getString("token", null);
            String patientId = prefs.getString("patientId", null);
            // I need the URL. I'll assume it's stored or I'll try to guess.
            // Better to update Plugin to save url.
            // For this step, I'll just use a method to get Supabase URL if passing it from
            // JS.
            String supabaseUrl = prefs.getString("supabaseUrl", "YOUR_SUPABASE_URL");
            String functionUrl = supabaseUrl + "/functions/v1/geofence-alert";

            if (token != null) {
                sendAlert(functionUrl, token, patientId, geofencingEvent.getTriggeringLocation().getLatitude(),
                        geofencingEvent.getTriggeringLocation().getLongitude());
            }
        }
    }

    private void sendAlert(String url, String token, String patientId, double lat, double lng) {
        OkHttpClient client = new OkHttpClient();

        JSONObject json = new JSONObject();
        try {
            json.put("patient_id", patientId);
            json.put("event_type", "EXIT");
            json.put("lat", lat);
            json.put("lng", lng);
            // No anon key usage requested!
        } catch (Exception e) {
            Log.e(TAG, "JSON Error", e);
        }

        RequestBody body = RequestBody.create(json.toString(), MediaType.get("application/json; charset=utf-8"));

        Request request = new Request.Builder()
                .url(url)
                .addHeader("Authorization", "Bearer " + token)
                .post(body)
                .build();

        // Async execution to not block receiver
        new Thread(() -> {
            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    Log.e(TAG, "Alert Failed: " + response.code());
                } else {
                    Log.i(TAG, "Alert Sent Successfully");
                }
            } catch (IOException e) {
                Log.e(TAG, "Network Error", e);
            }
        }).start();
    }
}
