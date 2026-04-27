"""
AgroSmart API - Data Models
Modèles de données pour la gestion agricole des fertilisants.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid


class Region(models.Model):
    """Région agricole marocaine."""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Région'
        verbose_name_plural = 'Régions'

    def __str__(self):
        return self.name


class Category(models.Model):
    """Catégorie de fertilisant."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, default='package')

    class Meta:
        ordering = ['name']
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'

    def __str__(self):
        return self.name


class Product(models.Model):
    """Produit fertilisant."""
    SEASON_CHOICES = [
        ('printemps', 'Printemps'),
        ('ete', 'Été'),
        ('automne', 'Automne'),
        ('hiver', 'Hiver'),
        ('toute_saison', 'Toute saison'),
    ]
    UNIT_CHOICES = [
        ('kg', 'Kilogramme'),
        ('tonne', 'Tonne'),
        ('litre', 'Litre'),
        ('sac_50kg', 'Sac 50kg'),
    ]

    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    description = models.TextField(blank=True)
    composition = models.CharField(max_length=200, blank=True, help_text="Ex: NPK 15-15-15")
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Prix en MAD")
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default='sac_50kg')
    stock_quantity = models.PositiveIntegerField(default=0)
    min_stock_alert = models.PositiveIntegerField(default=10)
    season_recommendation = models.CharField(max_length=20, choices=SEASON_CHOICES, default='toute_saison')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'

    def __str__(self):
        return f"{self.name} ({self.composition})"

    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.min_stock_alert


class Client(models.Model):
    """Client agriculteur ou coopérative."""
    full_name = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, related_name='clients')
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return self.full_name


class Order(models.Model):
    """Commande de fertilisants."""
    STATUS_CHOICES = [
        ('brouillon', 'Brouillon'),
        ('confirmee', 'Confirmée'),
        ('en_preparation', 'En préparation'),
        ('expediee', 'Expédiée'),
        ('livree', 'Livrée'),
        ('annulee', 'Annulée'),
    ]

    reference = models.CharField(max_length=20, unique=True, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='orders')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='brouillon')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    delivery_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Commande'
        verbose_name_plural = 'Commandes'

    def __str__(self):
        return f"{self.reference} - {self.client.full_name}"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = f"CMD-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def update_total(self):
        self.total_amount = sum(item.subtotal for item in self.items.all())
        self.save(update_fields=['total_amount'])


class OrderItem(models.Model):
    """Ligne de commande."""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = 'Ligne de commande'
        verbose_name_plural = 'Lignes de commande'

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"

    def save(self, *args, **kwargs):
        if not self.unit_price:
            self.unit_price = self.product.unit_price
        self.subtotal = self.quantity * self.unit_price
        super().save(*args, **kwargs)
