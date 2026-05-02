# Anime Backend

Mini backend Node.js com Express para busca de animes (Jikan API) e webscraping de players.

## Instalação

```bash
cd backend
npm install
```

## Execução

```bash
npm start    # Produção
npm run dev  # Desenvolvimento (com --watch)
```

Servidor roda em `http://localhost:3001`.

## Endpoints

### GET `/api/health`
Verifica se o servidor está rodando.

### GET `/api/anime/search?q=<query>`
Busca animes usando a Jikan API (MyAnimeList).

**Exemplo:** `curl "http://localhost:3001/api/anime/search?q=naruto"`

**Resposta:**
```json
{
  "results": [
    {
      "mal_id": 20,
      "title": "Naruto",
      "title_english": "Naruto",
      "images": { "jpg": { "image_url": "..." } },
      "synopsis": "...",
      "episodes": 220,
      "status": "Finished Airing",
      "score": 7.9,
      "year": 2002,
      "genres": ["Action", "Comedy"]
    }
  ]
}
```

### POST `/api/provider/search`
Pesquisa um anime diretamente nos providers (scraping).

**Body:**
```json
{
  "title": "jujutsu kaisen",
  "provider": "Animes Online"
}
```

**Resposta:**
```json
{
  "results": [
    {
      "title": "Jujutsu Kaisen",
      "url": "https://animesonlinecc.to/anime/jujutsu-kaisen",
      "image": "https://..."
    }
  ]
}
```

### POST `/api/scrape`
Faz o scraping de uma página de episódio de anime para capturar o player.

**Body:**
```json
{
  "url": "https://animesonlinecc.to/episodio/naruto-1",
  "provider": "Animes Online"
}
```

**Resposta:**
```json
{
  "success": true,
  "videoUrl": "https://player.exemplo.com/video.mp4",
  "provider": "Animes Online"
}
```

## Configuração

Edite `providers.js` para adicionar novos sites. Cada provider tem:
- `name`: Nome identificador
- `url`: URL base do site
- `selectors`: Seletores CSS para encontrar vídeo/iframe
- `clickSelectors`: Seletores para clicar (botão play)
- `getSearchUrl(title)`: Método que gera URL de busca no provider

## Como funciona

### Busca Jikan
1. Recebe query de busca
2. Faz requisição para Jikan API com rate limiting
3. Retorna lista de animes do MyAnimeList

### Busca no Provider
1. Recebe título e provider
2. Constrói URL de busca específica do provider
3. Abre browser headless (Puppeteer)
4. Extrai resultados da página de busca
5. Retorna títulos e links encontrados

### Scraping de Vídeo
1. Recebe URL do episódio
2. Abre browser headless
3. Tenta encontrar vídeo/iframe via seletores
4. Se não achar, clica no botão play
5. Captura URL do player
6. Retorna URL do vídeo
