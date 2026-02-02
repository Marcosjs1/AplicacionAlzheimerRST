package com.marcos.RSTMindHealth;

import android.Manifest;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationServices;

@CapacitorPlugin(name = "GeofencePlugin")
public class GeofencePlugin extends Plugin {

    private GeofencingClient geofencingClient;

    @Override
    public void load() {
        geofencingClient = LocationServices.getGeofencingClient(getContext());
    }

    @PluginMethod
    public void start(PluginCall call) {
        Double lat = call.getDouble("lat");
        Double lng = call.getDouble("lng");
        Integer radius = call.getInt("radius");
        String patientId = call.getString("patientId");
        String token = call.getString("token"); // Bearer token
        String supabaseUrl = call.getString("supabaseUrl");

        if (lat == null || lng == null || radius == null || patientId == null || token == null || supabaseUrl == null) {
            call.reject("Missing required parameters");
            return;
        }

        // Save Auth Config for Receiver
        SharedPreferences prefs = getContext().getSharedPreferences("GeofenceConfig", Context.MODE_PRIVATE);
        prefs.edit()
                .putString("patientId", patientId)
                .putString("token", token)
                .putString("supabaseUrl", supabaseUrl)
                .putFloat("lat", lat.floatValue())
                .putFloat("lng", lng.floatValue())
                .apply();

        if (ActivityCompat.checkSelfPermission(getContext(),
                Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            call.reject("Location permission not granted");
            return;
        }

        Geofence geofence = new Geofence.Builder()
                .setRequestId("SAFE_ZONE")
                .setCircularRegion(lat, lng, radius)
                .setExpirationDuration(Geofence.NEVER_EXPIRE)
                .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_EXIT)
                .build();

        GeofencingRequest request = new GeofencingRequest.Builder()
                .setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_EXIT)
                .addGeofence(geofence)
                .build();

        geofencingClient.addGeofences(request, getGeofencePendingIntent())
                .addOnSuccessListener(aVoid -> {
                    Log.d("GeofencePlugin", "Geofence Added");
                    call.resolve();
                })
                .addOnFailureListener(e -> {
                    Log.e("GeofencePlugin", "Geofence Add Failed", e);
                    call.reject("Failed to add geofence", e);
                });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        geofencingClient.removeGeofences(getGeofencePendingIntent())
                .addOnSuccessListener(aVoid -> {
                    Log.d("GeofencePlugin", "Geofence Removed");
                    call.resolve();
                })
                .addOnFailureListener(e -> {
                    call.reject("Failed to remove geofence", e);
                });
    }

    private PendingIntent getGeofencePendingIntent() {
        Intent intent = new Intent(getContext(), GeofenceBroadcastReceiver.class);
        return PendingIntent.getBroadcast(getContext(), 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);
    }
}
