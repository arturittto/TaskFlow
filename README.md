1. Mājaslapas / lietotnes mērķis
Izstrādātā lietotne TaskFlow ir paredzēta, lai lietotāji varētu efektīvi pārvaldīt savus uzdevumus, piezīmes un mērķus, kā arī sadarboties ar citiem lietotājiem. Tā piedāvā funkcionalitāti uzdevumu izveidei, rediģēšanai, termiņu pievienošanai, koplietošanai ar citiem un uzdevumu filtrēšanai. Lietotne ir pieejama tiešsaistē un to var izmantot jebkurā ierīcē.

2. Izvēlētais risinājums un tehnoloģijas
Lai sasniegtu šo mērķi, tika izmantotas šādas tehnoloģijas:

React – dinamiskai lietotāja saskarnei;

Tailwind CSS – ātrai un adaptīvai dizaina izstrādei;

Firebase (Auth + Firestore + Hosting) – datu glabāšanai, lietotāju autentifikācijai un hostēšanai;

GitHub + GitHub Actions – versiju kontrolei un automātiskai publicēšanai.

3. Lietotnes dizains
Tika izveidots responsīvs, vienkāršs un intuitīvs dizains, izmantojot komponentu struktūru. Lietotne piedāvā arī gaišo un tumšo režīmu (dark/light mode), kas lietotājam nodrošina personalizētu pieredzi. Katram lietotājam ir sava informācijas telpa (uzdevumi/piezīmes), kā arī iespēja dalīties ar citiem.

4. Dizaina pārveidošana kodā
Dizains tika realizēts kā React komponentes, izmantojot Tailwind CSS klasifikāciju tieši HTML elementiem. Komponentes sadalītas pa lapām (/dashboard, /notes, /login, /register) ar atbilstošu maršrutēšanu.

5. Teksta ievietošana un testēšana
Visi lietotāja saskarnes teksti tika ievietoti angļu valodā. Tika veikta manuāla testēšana dažādos pārlūkos un ierīcēs, pārbaudot lietotnes funkcionalitāti (reģistrācija, uzdevumu pievienošana, rediģēšana, koplietošana, dzēšana utt.). Tika pārbaudīta arī Firebase datu drošība un piekļuves kontrole.

6. Apakšlapu dizains
Tika izveidotas vairākas apakšlapas:

/login – lietotāja pieteikšanās;

/register – lietotāja reģistrācija;

/dashboard – galvenais uzdevumu pārvaldības skats;

/notes – piezīmju pārvaldības skats.
