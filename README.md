### Repositório front-end do teste prático do processo seletivo para desenvolvedor da UNYLEYA


#### Apresentação da solução
Para desenvolvimento do front-end, foi utilizado o [Gatsby.js](https://www.gatsbyjs.org/docs/ "Gatsby.js") que por sua vez permite o desenvolvimento em [React](https://pt-br.reactjs.org/ "React"). 

A justificativa da escolha é pelo gatsby proporcionar um desenvolvimento rápido, efetivo e performático.

Além disso, foram utilizadas bibliotecas de terceiros com a finalidade de melhorar a experiência do usuário, tais como [react-bootratrap](https://react-bootstrap.github.io/ "react-bootratrap"), [sweet alert](https://sweetalert.js.org/ "sweet alert") etc.

Para abstrair as requisições AJAX, foi utilizada a biblioteca Axios.

#### Requisitos para instalação
- Node
- NPM
- Gatsby ([clique aqui](https://www.gatsbyjs.com/docs/quick-start/ "clique aqui") para abrir o link da documentação da instalação)

#### Procedimentos para instalação
- Clone o projeto https://github.com/marconycaldeira/unyleya-front-end
- Dentro do diretório recém clonado, instale os pacotes node a partir do comando `npm install`
- Execute o comando `gatsby develop`
- Acesse pelo seu navegador o endereço informado no terminal (o padrão é http://localhost:8000)

#### Possiveis problemas
- Os problemas mais frequentes do ecossistema Gatsby/React giram em torno dos seus pacotes e gerenciadores de dependência (npm, yarn, node .etc), logo certifique-se de que todas essas ferramentas estejam atualizadas.
- Outro problema possível de acontecer é quanto a URL do end-point base da API que a aplicação consome. Se por ventura a o endereço estiver inacessível, certifique-se de que sua API esteja online e se o endereço dela está como o mesmo do [arquivo de instância do axios](https://github.com/marconycaldeira/unyleya-front-end/blob/master/src/services/http.js "arquivo de instância do axios"). **Muita atenção com o numero da porta**
