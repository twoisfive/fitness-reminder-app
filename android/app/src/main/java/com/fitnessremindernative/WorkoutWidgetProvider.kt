package com.fitnessremindernative

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews
import android.content.ComponentName

class WorkoutWidgetProvider : AppWidgetProvider() {

    companion object {
        fun updateWorkout(context: Context, name: String, time: String) {
            val manager = AppWidgetManager.getInstance(context)
            val ids = manager.getAppWidgetIds(ComponentName(context, WorkoutWidgetProvider::class.java))

            for (id in ids) {
                val views = RemoteViews(context.packageName, R.layout.widget_layout)
                views.setTextViewText(R.id.widgetWorkoutName, name)
                views.setTextViewText(R.id.widgetWorkoutTime, time)
                manager.updateAppWidget(id, views)
            }
        }
    }
}
