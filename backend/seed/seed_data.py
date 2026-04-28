"""
AgroSmart - Seed Data
Generates realistic agricultural data for the application.
Usage: python manage.py shell < seed/seed_data.py
"""
import os
import sys
import django
import random
from decimal import Decimal
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agrosmart.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Region, Category, Product, Client, Order, OrderItem

print("=" * 50)
print("AgroSmart - Seeding Database...")
print("=" * 50)

# --- Clear existing data ---
OrderItem.objects.all().delete()
Order.objects.all().delete()
Client.objects.all().delete()
Product.objects.all().delete()
Category.objects.all().delete()
Region.objects.all().delete()

# --- Create superuser ---
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@agrosmart.ma', 'admin123')
    print("[OK] Superuser 'admin' created (password: admin123)")

if not User.objects.filter(username='commercial').exists():
    user = User.objects.create_user('commercial', 'commercial@agrosmart.ma', 'commercial123')
    user.first_name = 'Ahmed'
    user.last_name = 'Bennani'
    user.save()
    print("[OK] User 'commercial' created")

# --- Regions ---
regions_data = [
    ('Souss-Massa', 'SM'), ('Marrakech-Safi', 'MS'), ('Fes-Meknes', 'FM'),
    ('Rabat-Sale-Kenitra', 'RSK'), ('Casablanca-Settat', 'CS'), ('Beni Mellal-Khenifra', 'BMK'),
    ('Draa-Tafilalet', 'DT'), ('Oriental', 'OR'),
]
regions = {}
for name, code in regions_data:
    r = Region.objects.create(name=name, code=code)
    regions[code] = r
print(f"[OK] {len(regions)} regions created")

# --- Categories ---
categories_data = [
    ('Engrais Azotes', 'Engrais riches en azote pour la croissance vegetative', 'leaf'),
    ('Engrais Phosphates', 'Engrais riches en phosphore pour l\'enracinement', 'target'),
    ('Engrais Potassiques', 'Engrais riches en potassium pour la fructification', 'zap'),
    ('NPK Composes', 'Engrais complets equilibres', 'layers'),
    ('Engrais Bio', 'Engrais organiques et biologiques certifies', 'sprout'),
    ('Amendements', 'Produits d\'amelioration du sol', 'mountain'),
]
categories = {}
for name, desc, icon in categories_data:
    c = Category.objects.create(name=name, description=desc, icon=icon)
    categories[name] = c
print(f"[OK] {len(categories)} categories created")

# --- Products ---
products_data = [
    ('Uree 46%', 'Engrais Azotes', 'N 46-0-0', 280, 'sac_50kg', 450, 'printemps'),
    ('Ammonitrate 33.5%', 'Engrais Azotes', 'N 33.5-0-0', 320, 'sac_50kg', 380, 'printemps'),
    ('Sulfate d\'Ammonium 21%', 'Engrais Azotes', 'N 21-0-0-24S', 250, 'sac_50kg', 200, 'toute_saison'),
    ('Super Triple 45%', 'Engrais Phosphates', 'P 0-45-0', 420, 'sac_50kg', 320, 'automne'),
    ('DAP 18-46-0', 'Engrais Phosphates', 'NP 18-46-0', 580, 'sac_50kg', 280, 'automne'),
    ('MAP 12-61-0', 'Engrais Phosphates', 'NP 12-61-0', 620, 'sac_50kg', 150, 'automne'),
    ('Sulfate de Potassium', 'Engrais Potassiques', 'K 0-0-50', 550, 'sac_50kg', 190, 'ete'),
    ('Chlorure de Potassium', 'Engrais Potassiques', 'K 0-0-60', 480, 'sac_50kg', 250, 'toute_saison'),
    ('NPK 15-15-15', 'NPK Composes', 'NPK 15-15-15', 520, 'sac_50kg', 600, 'toute_saison'),
    ('NPK 20-20-20 Hydrosoluble', 'NPK Composes', 'NPK 20-20-20', 850, 'kg', 180, 'printemps'),
    ('NPK 12-24-12', 'NPK Composes', 'NPK 12-24-12', 560, 'sac_50kg', 340, 'automne'),
    ('NPK 10-30-10', 'NPK Composes', 'NPK 10-30-10', 540, 'sac_50kg', 220, 'automne'),
    ('Compost Enrichi Premium', 'Engrais Bio', 'Bio NPK 3-2-2', 180, 'sac_50kg', 500, 'toute_saison'),
    ('Guano Marin', 'Engrais Bio', 'Bio NP 10-8-2', 750, 'kg', 120, 'printemps'),
    ('Acide Humique Granule', 'Engrais Bio', 'Humus 65%', 420, 'kg', 200, 'toute_saison'),
    ('Fumier Composte', 'Engrais Bio', 'Bio NPK 2-1-2', 120, 'tonne', 80, 'hiver'),
    ('Gypse Agricole', 'Amendements', 'CaSO4 80%', 150, 'tonne', 300, 'hiver'),
    ('Chaux Agricole', 'Amendements', 'CaCO3 85%', 130, 'tonne', 250, 'hiver'),
    ('Soufre Agricole', 'Amendements', 'S 99%', 380, 'kg', 170, 'automne'),
    ('Oligo-elements Chelates', 'Amendements', 'Fe-Zn-Mn-Cu-B', 950, 'kg', 90, 'printemps'),
    ('NPK 14-28-14', 'NPK Composes', 'NPK 14-28-14', 580, 'sac_50kg', 260, 'automne'),
    ('Nitrate de Calcium', 'Engrais Azotes', 'N 15.5-0-0-26Ca', 450, 'sac_50kg', 160, 'printemps'),
    ('Phosphate Naturel', 'Engrais Phosphates', 'P 0-30-0', 280, 'tonne', 400, 'automne'),
    ('Potasse Magnesia', 'Engrais Potassiques', 'K 0-0-30-10Mg', 620, 'sac_50kg', 140, 'ete'),
    ('Engrais Foliaire Complet', 'NPK Composes', 'NPK 10-10-10+TE', 1200, 'kg', 95, 'printemps'),
]
products = []
for name, cat_name, comp, price, unit, stock, season in products_data:
    p = Product.objects.create(
        name=name, category=categories[cat_name], composition=comp,
        unit_price=Decimal(str(price)), unit=unit, stock_quantity=stock,
        season_recommendation=season, description=f"Fertilisant {comp} de haute qualite pour l'agriculture marocaine."
    )
    products.append(p)
print(f"[OK] {len(products)} products created")

# --- Clients ---
clients_data = [
    ('Hassan El Amrani', 'Cooperative Al Baraka', '0661234567', 'SM'),
    ('Fatima Zahra Idrissi', 'Ferme Idrissi SARL', '0672345678', 'MS'),
    ('Mohamed Tazi', 'Agri-Tazi', '0683456789', 'FM'),
    ('Khadija Bennani', 'Cooperative Al Firdaws', '0694567890', 'RSK'),
    ('Youssef El Mansouri', 'Domaine El Mansouri', '0605678901', 'CS'),
    ('Aicha Berrada', 'Bio-Souss Export', '0616789012', 'SM'),
    ('Omar Chraibi', 'Chraibi Agriculture', '0627890123', 'BMK'),
    ('Salma Alaoui', 'Cooperative Tadla Verte', '0638901234', 'BMK'),
    ('Rachid Fassi', 'Fassi Olives SARL', '0649012345', 'FM'),
    ('Nadia El Khattabi', 'Primeurs du Gharb', '0650123456', 'RSK'),
    ('Abdelkader Moussaoui', 'Moussaoui Cereales', '0661234568', 'OR'),
    ('Samira Benjelloun', 'Dattes Tafilalet Premium', '0672345679', 'DT'),
    ('Khalid Zniber', 'Domaine Zniber Vins', '0683456790', 'MS'),
    ('Leila El Ouazzani', 'Cooperative Rif Vert', '0694567891', 'OR'),
    ('Hamid Benkirane', 'Agrumes du Souss', '0605678902', 'SM'),
]
clients = []
for name, company, phone, region_code in clients_data:
    c = Client.objects.create(
        full_name=name, company=company, phone=phone,
        email=f"{name.lower().replace(' ', '.')}@email.ma",
        region=regions[region_code],
        address=f"Zone agricole, {regions[region_code].name}"
    )
    clients.append(c)
print(f"[OK] {len(clients)} clients created")

# --- Orders (12 months of data) ---
statuses = ['confirmee', 'en_preparation', 'expediee', 'livree', 'livree', 'livree']
commercial = User.objects.get(username='commercial')
order_count = 0

from django.utils import timezone as tz

for months_ago in range(12, -1, -1):
    base_date = tz.now() - timedelta(days=months_ago * 30)
    # More orders in spring/autumn (high season)
    month_num = base_date.month
    if month_num in [3, 4, 5, 9, 10, 11]:
        num_orders = random.randint(6, 10)
    elif month_num in [6, 7, 8]:
        num_orders = random.randint(3, 5)
    else:
        num_orders = random.randint(4, 7)

    for _ in range(num_orders):
        client = random.choice(clients)
        order_date = base_date + timedelta(days=random.randint(0, 28))

        order = Order(
            client=client,
            created_by=commercial,
            status=random.choice(statuses) if months_ago > 0 else 'confirmee',
            notes=random.choice(['', 'Livraison urgente', 'Client fidele - remise', 'Commande saisonniere', '']),
            delivery_date=(order_date + timedelta(days=random.randint(3, 14))).date(),
        )
        order.save()
        # Override created_at
        Order.objects.filter(pk=order.pk).update(created_at=order_date)

        # Add 1-5 items per order
        num_items = random.randint(1, 5)
        selected_products = random.sample(products, min(num_items, len(products)))
        for product in selected_products:
            qty = random.randint(1, 20)
            OrderItem.objects.create(
                order=order, product=product,
                quantity=qty, unit_price=product.unit_price,
                subtotal=qty * product.unit_price
            )
        order.update_total()
        order_count += 1

print(f"[OK] {order_count} orders created with items")
print("=" * 50)
print("Seeding complete!")
print("Login: admin / admin123")
print("Commercial: commercial / commercial123")
print("=" * 50)
