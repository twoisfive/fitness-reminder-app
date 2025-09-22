package com.fitnessremindernative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class WorkoutWidgetModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "WorkoutWidgetModule" // JS will use this name
    }

    @ReactMethod
    fun updateWorkout(name: String, time: String) {
        val context = reactApplicationContext
        WorkoutWidgetProvider.updateWorkout(context, name, time)
    }
}
