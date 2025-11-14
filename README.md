# RSS Reader Vercel App

Instructions pour déployer l'app sur Vercel avec Vercel KV (Upstash Redis)

1. Créez un compte et une base Vercel KV sur Vercel ou Upstash.
2. Récupérez vos clés d'API et ajoutez-les dans un fichier `.env` à la racine :

```
KV_REST_API_URL=your_upstash_rest_url
KV_REST_API_TOKEN=your_upstash_rest_token
```

3. Faites `npm install` pour installer les dépendances
4. Lancez `npx vercel dev` pour tester en local
5. Poussez sur GitHub ou faites `vercel --prod` pour déployer
6. L'app sera disponible à l'URL fournie par Vercel
