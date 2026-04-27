"""Seed the database with realistic agricultural data."""
import random
from decimal import Decimal
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import Region, Category, Product, Client, Order, OrderItem


class Command(BaseCommand):
    help = 'Seed database with realistic agricultural data'

    def handle(self, *args, **options):
        self.stdout.write("=" * 50)
        self.stdout.write("AgroSmart - Seeding Database...")
        self.stdout.write("=" * 50)

        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        Client.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        Region.objects.all().delete()

        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@agrosmart.ma', 'admin123')
            self.stdout.write(self.style.SUCCESS("Superuser 'admin' created"))

        if not User.objects.filter(username='commercial').exists():
            u = User.objects.create_user('commercial', 'commercial@agrosmart.ma', 'commercial123')
            u.first_name, u.last_name = 'Ahmed', 'Bennani'
            u.save()
            self.stdout.write(self.style.SUCCESS("User 'commercial' created"))

        regions_data = [
            ('Souss-Massa', 'SM'), ('Marrakech-Safi', 'MS'), ('Fes-Meknes', 'FM'),
            ('Rabat-Sale-Kenitra', 'RSK'), ('Casablanca-Settat', 'CS'),
            ('Beni Mellal-Khenifra', 'BMK'), ('Draa-Tafilalet', 'DT'), ('Oriental', 'OR'),
        ]
        regions = {}
        for name, code in regions_data:
            regions[code] = Region.objects.create(name=name, code=code)
        self.stdout.write(self.style.SUCCESS(f"{len(regions)} regions"))

        cats_data = [
            ('Engrais Azotes', 'Engrais riches en azote', 'leaf'),
            ('Engrais Phosphates', 'Engrais riches en phosphore', 'target'),
            ('Engrais Potassiques', 'Engrais riches en potassium', 'zap'),
            ('NPK Composes', 'Engrais complets equilibres', 'layers'),
            ('Engrais Bio', 'Engrais organiques certifies', 'sprout'),
            ('Amendements', 'Produits amelioration du sol', 'mountain'),
        ]
        cats = {}
        for name, desc, icon in cats_data:
            cats[name] = Category.objects.create(name=name, description=desc, icon=icon)
        self.stdout.write(self.style.SUCCESS(f"{len(cats)} categories"))

        prods_data = [
            ('Uree 46%', 'Engrais Azotes', 'N 46-0-0', 280, 'sac_50kg', 450, 'printemps'),
            ('Ammonitrate 33.5%', 'Engrais Azotes', 'N 33.5-0-0', 320, 'sac_50kg', 380, 'printemps'),
            ('Sulfate Ammonium 21%', 'Engrais Azotes', 'N 21-0-0-24S', 250, 'sac_50kg', 200, 'toute_saison'),
            ('Super Triple 45%', 'Engrais Phosphates', 'P 0-45-0', 420, 'sac_50kg', 320, 'automne'),
            ('DAP 18-46-0', 'Engrais Phosphates', 'NP 18-46-0', 580, 'sac_50kg', 280, 'automne'),
            ('MAP 12-61-0', 'Engrais Phosphates', 'NP 12-61-0', 620, 'sac_50kg', 150, 'automne'),
            ('Sulfate de Potassium', 'Engrais Potassiques', 'K 0-0-50', 550, 'sac_50kg', 190, 'ete'),
            ('Chlorure de Potassium', 'Engrais Potassiques', 'K 0-0-60', 480, 'sac_50kg', 250, 'toute_saison'),
            ('NPK 15-15-15', 'NPK Composes', 'NPK 15-15-15', 520, 'sac_50kg', 600, 'toute_saison'),
            ('NPK 20-20-20 Hydro', 'NPK Composes', 'NPK 20-20-20', 850, 'kg', 180, 'printemps'),
            ('NPK 12-24-12', 'NPK Composes', 'NPK 12-24-12', 560, 'sac_50kg', 340, 'automne'),
            ('NPK 10-30-10', 'NPK Composes', 'NPK 10-30-10', 540, 'sac_50kg', 220, 'automne'),
            ('Compost Enrichi', 'Engrais Bio', 'Bio NPK 3-2-2', 180, 'sac_50kg', 500, 'toute_saison'),
            ('Guano Marin', 'Engrais Bio', 'Bio NP 10-8-2', 750, 'kg', 120, 'printemps'),
            ('Acide Humique', 'Engrais Bio', 'Humus 65%', 420, 'kg', 200, 'toute_saison'),
            ('Fumier Composte', 'Engrais Bio', 'Bio NPK 2-1-2', 120, 'tonne', 80, 'hiver'),
            ('Gypse Agricole', 'Amendements', 'CaSO4 80%', 150, 'tonne', 300, 'hiver'),
            ('Chaux Agricole', 'Amendements', 'CaCO3 85%', 130, 'tonne', 250, 'hiver'),
            ('Soufre Agricole', 'Amendements', 'S 99%', 380, 'kg', 170, 'automne'),
            ('Oligo-elements', 'Amendements', 'Fe-Zn-Mn-Cu-B', 950, 'kg', 90, 'printemps'),
            ('NPK 14-28-14', 'NPK Composes', 'NPK 14-28-14', 580, 'sac_50kg', 260, 'automne'),
            ('Nitrate de Calcium', 'Engrais Azotes', 'N 15.5-0-0-26Ca', 450, 'sac_50kg', 160, 'printemps'),
            ('Phosphate Naturel', 'Engrais Phosphates', 'P 0-30-0', 280, 'tonne', 400, 'automne'),
            ('Potasse Magnesia', 'Engrais Potassiques', 'K 0-0-30-10Mg', 620, 'sac_50kg', 140, 'ete'),
            ('Engrais Foliaire', 'NPK Composes', 'NPK 10-10-10+TE', 1200, 'kg', 95, 'printemps'),
        ]
        products = []
        for name, cat, comp, price, unit, stock, season in prods_data:
            products.append(Product.objects.create(
                name=name, category=cats[cat], composition=comp,
                unit_price=Decimal(str(price)), unit=unit, stock_quantity=stock,
                season_recommendation=season,
                description=f"Fertilisant {comp} haute qualite pour agriculture marocaine."
            ))
        self.stdout.write(self.style.SUCCESS(f"{len(products)} products"))

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
            ('Samira Benjelloun', 'Dattes Tafilalet', '0672345679', 'DT'),
            ('Khalid Zniber', 'Domaine Zniber', '0683456790', 'MS'),
            ('Leila El Ouazzani', 'Cooperative Rif Vert', '0694567891', 'OR'),
            ('Hamid Benkirane', 'Agrumes du Souss', '0605678902', 'SM'),
        ]
        clients = []
        for name, company, phone, rc in clients_data:
            clients.append(Client.objects.create(
                full_name=name, company=company, phone=phone,
                email=f"{name.lower().replace(' ', '.')}@email.ma",
                region=regions[rc], address=f"Zone agricole, {regions[rc].name}"
            ))
        self.stdout.write(self.style.SUCCESS(f"{len(clients)} clients"))

        statuses = ['confirmee', 'en_preparation', 'expediee', 'livree', 'livree', 'livree']
        commercial = User.objects.get(username='commercial')
        order_count = 0

        for months_ago in range(12, -1, -1):
            base_date = timezone.now() - timedelta(days=months_ago * 30)
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
                    client=client, created_by=commercial,
                    status=random.choice(statuses) if months_ago > 0 else 'confirmee',
                    notes=random.choice(['', 'Livraison urgente', 'Client fidele', '']),
                    delivery_date=(order_date + timedelta(days=random.randint(3, 14))).date(),
                )
                order.save()
                Order.objects.filter(pk=order.pk).update(created_at=order_date)

                num_items = random.randint(1, 5)
                sel = random.sample(products, min(num_items, len(products)))
                for product in sel:
                    qty = random.randint(1, 20)
                    OrderItem.objects.create(
                        order=order, product=product, quantity=qty,
                        unit_price=product.unit_price,
                        subtotal=qty * product.unit_price
                    )
                order.update_total()
                order_count += 1

        self.stdout.write(self.style.SUCCESS(f"{order_count} orders with items"))
        self.stdout.write("=" * 50)
        self.stdout.write("Seeding complete!")
        self.stdout.write("Login: admin / admin123")
        self.stdout.write("Commercial: commercial / commercial123")
