from django.contrib import admin
from .models import User, Team, Activity, Workout, Leaderboard


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Admin interface for User model"""
    list_display = ['username', 'full_name', 'email', 'team_id', 'role', 'created_at']
    list_filter = ['team_id', 'role', 'created_at']
    search_fields = ['username', 'full_name', 'email']
    readonly_fields = ['created_at']
    ordering = ['-created_at']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    """Admin interface for Team model"""
    list_display = ['_id', 'name', 'description', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']
    ordering = ['name']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    """Admin interface for Activity model"""
    list_display = ['user_id', 'type', 'duration_minutes', 'distance_km', 'points', 'date', 'created_at']
    list_filter = ['type', 'date', 'created_at']
    search_fields = ['user_id', 'type', 'notes']
    readonly_fields = ['created_at']
    ordering = ['-date']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    """Admin interface for Workout model"""
    list_display = ['name', 'type', 'duration_minutes', 'difficulty', 'created_at']
    list_filter = ['type', 'difficulty', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']
    ordering = ['name']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    """Admin interface for Leaderboard model"""
    list_display = ['rank', 'type', 'get_name', 'points', 'updated_at']
    list_filter = ['type', 'updated_at']
    search_fields = ['full_name', 'team_name', 'user_id', 'team_id']
    readonly_fields = ['updated_at']
    ordering = ['rank']
    
    def get_name(self, obj):
        """Return the appropriate name based on type"""
        if obj.type == 'individual':
            return obj.full_name
        return obj.team_name
    get_name.short_description = 'Name'
