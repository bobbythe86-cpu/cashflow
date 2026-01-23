# Supabase Adatbázis Migráció

## Lépések az adatbázis beállításához

1. **Nyisd meg a Supabase Dashboard-ot:**
   - Menj a https://supabase.com/dashboard címre
   - Jelentkezz be a fiókodba
   - Válaszd ki a projektedet

2. **SQL Editor megnyitása:**
   - A bal oldali menüben kattints a **"SQL Editor"** opcióra
   - Kattints az **"+ New query"** gombra

3. **Futtasd a migrációkat a következő sorrendben:**

   **1. Profiles tábla:**
   - Másold be a `supabase_migrations/profiles.sql` tartalmát
   - Kattints a **"Run"** gombra (vagy Ctrl+Enter)

   **2. Categories tábla:**
   - Új query-t nyiss
   - Másold be a `supabase_migrations/categories.sql` tartalmát
   - Kattints a **"Run"** gombra

   **3. Transactions tábla:**
   - Új query-t nyiss
   - Másold be a `supabase_migrations/transactions.sql` tartalmát
   - Kattints a **"Run"** gombra

   **4. Recurring Transactions tábla:**
   - Új query-t nyiss
   - Másold be a `supabase_migrations/recurring_transactions.sql` tartalmát
   - Kattints a **"Run"** gombra

4. **Ellenőrzés:**
   - A bal oldali menüben kattints a **"Table Editor"** opcióra
   - Ellenőrizd, hogy az alábbi táblák létrejöttek-e:
     - profiles
     - categories
     - transactions
     - recurring_transactions

5. **Tesztelés:**
   - Indítsd újra a Next.js szervert (ha fut)
   - Próbálj meg új rendszeres tranzakciót létrehozni

## Hibaelhárítás

Ha hibát kapsz a futtatás során:
- Ellenőrizd, hogy a táblák még nem léteznek-e (ha igen, törölheted őket vagy módosíthatod a CREATE TABLE parancsokat)
- Nézd meg a Supabase Dashboard "Logs" részét a részletes hibaüzenetekért
- Győződj meg róla, hogy a `auth.users` tábla létezik (ez alapértelmezetten jön a Supabase-szel)

## Megjegyzések

- Az összes tábla Row Level Security (RLS) védelemmel rendelkezik
- A felhasználók csak a saját adataikat láthatják és módosíthatják
- A categories táblában vannak alapértelmezett kategóriák (közös kategóriák, user_id = NULL)
- A profiles tábla automatikusan létrejön új felhasználó regisztrációjakor
