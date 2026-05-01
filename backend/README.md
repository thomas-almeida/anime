# Anime Backend

Mini backend Node.js com Express para fazer webscraping de players de anime.

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

### POST `/api/scrape`
Faz o scraping de uma página de episódio de anime.

**Body:**
```json
{
  "url": "https://animesonlinecc.to/episodio/naruto-1",
  "provider": "Animes Online"  // opcional
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

Edite `providers.js` para adicionar novos sites de anime. Cada provider deve ter:
- `name`: Nome identificador
- `url`: URL base do site
- `selectors`: Array de seletores CSS para encontrar o vídeo/iframe
- `clickSelectors`: Array de seletores para clicar (botão play, etc)

## Como funciona

1. Recebe URL do episódio
2. Abre um browser headless (Puppeteer)
3. Carrega a página
4. Tenta encontrar o vídeo/iframe usando os seletores definidos
5. Se não encontrar, tenta clicar no botão play
6. Captura a URL do vídeo/iframe
7. Retorna a URL para o frontend
