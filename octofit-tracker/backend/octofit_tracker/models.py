from djongo import models


class User(models.Model):
    """User model for fitness app users"""
    _id = models.ObjectIdField(db_column='_id', primary_key=True)
    email = models.EmailField(unique=True, max_length=255)
    username = models.CharField(max_length=100, unique=True)
    full_name = models.CharField(max_length=255)
    team_id = models.CharField(max_length=100)
    role = models.CharField(max_length=50, default='hero')
    avatar = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    stats = models.JSONField(default=dict)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.full_name} ({self.username})"


class Team(models.Model):
    """Team model for fitness groups"""
    _id = models.CharField(max_length=100, primary_key=True, db_column='_id')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.JSONField(default=list)
    
    class Meta:
        db_table = 'teams'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Activity(models.Model):
    """Activity model for tracking fitness activities"""
    _id = models.ObjectIdField(db_column='_id', primary_key=True)
    user_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    duration_minutes = models.IntegerField()
    distance_km = models.FloatField(blank=True, null=True)
    points = models.IntegerField(default=0)
    date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activities'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.user_id} - {self.type} ({self.duration_minutes} min)"


class Workout(models.Model):
    """Workout model for predefined workout plans"""
    _id = models.ObjectIdField(db_column='_id', primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=100)
    duration_minutes = models.IntegerField()
    difficulty = models.CharField(max_length=50)
    exercises = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'workouts'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.type})"


class Leaderboard(models.Model):
    """Leaderboard model for rankings"""
    _id = models.ObjectIdField(db_column='_id', primary_key=True)
    type = models.CharField(max_length=50)  # 'individual' or 'team'
    user_id = models.CharField(max_length=100, blank=True, null=True)
    team_id = models.CharField(max_length=100, blank=True, null=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    team_name = models.CharField(max_length=255, blank=True, null=True)
    points = models.IntegerField(default=0)
    activities_count = models.IntegerField(default=0, blank=True, null=True)
    members_count = models.IntegerField(default=0, blank=True, null=True)
    rank = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leaderboard'
        ordering = ['rank']
    
    def __str__(self):
        if self.type == 'individual':
            return f"#{self.rank} {self.full_name} - {self.points} pts"
        else:
            return f"#{self.rank} {self.team_name} - {self.points} pts"
