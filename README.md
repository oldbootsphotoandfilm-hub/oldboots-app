# Old Boots · Bastidores (app instalável)

Endereço: https://app.oldbootsphotoandfilm.com

- `index.html` — casca da app: carrega a página `paginas/bastidores.html` do repositório **oldboots-site** (a mesma do site). As mudanças ao Bastidores fazem-se lá; esta app recebe-as sozinha e mostra «Versão nova disponível · Atualizar».
- `sw.js` — guarda a app no aparelho (abre logo, mesmo com rede fraca). Os dados vêm sempre do servidor; nunca ficam guardados aqui.
- `manifest.webmanifest` + ícones — instalação no ecrã principal.
- `CNAME` — domínio próprio (registo CNAME `app` na Hostinger → `oldbootsphotoandfilm-hub.github.io`).

Só é preciso mexer aqui para mudar o ícone, o nome da app ou a forma de guardar (nesse caso, mudar `V` em `sw.js`).
