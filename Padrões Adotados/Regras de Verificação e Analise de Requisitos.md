# Regras de Verificação e Análise de Requisitos
 
**Projeto:** Guardião da Cozinha  
**Versão:** 1.0  
**Data:** Junho de 2026  
**Equipe:** Gilson dos Santos Júnior, Izac Moreira Souza Junior
 
---
 
## 📋 Sumário
 
1. [Objetivo](#1-objetivo)
2. [Padronização de Nomenclatura](#2-padronização-de-nomenclatura)
   - 2.1 [Requisitos Funcionais](#21-requisitos-funcionais-rf)
   - 2.2 [Requisitos Não Funcionais](#22-requisitos-não-funcionais-rnf)
   - 2.3 [Atores](#23-atores)
3. [Regras de Especificação de Requisitos](#3-regras-de-especificação-de-requisitos)
   - Regra 1 — Completude
   - Regra 2 — Consistência
   - Regra 3 — Não-Ambiguidade
   - Regra 4 — Verificabilidade
   - Regra 5 — Rastreabilidade
4. [Padronização da Estrutura de Cada Requisito](#4-padronização-da-estrutura-de-cada-requisito)
5. [Checklist de Verificação](#5-checklist-de-verificação)
---
 
## 1. Objetivo
 
Este documento define as regras e padrões que **devem ser obrigatoriamente seguidos** por toda a equipe ao redigir, revisar e manter o Documento de Requisitos do projeto **Guardião da Cozinha**.
 
Seu propósito é garantir que os requisitos sejam escritos de forma uniforme, clara e de alta qualidade, independentemente de qual membro da equipe os tenha elaborado. As regras aqui descritas são baseadas nos princípios de **Especificação de Requisitos** abordados no Capítulo 1 do livro *Engenharia de Software* de **Rogério Magela**, adotado como referência na disciplina.
 
> ⚠️ **Todo novo requisito, antes de ser incorporado ao documento oficial, deve ser verificado contra as regras deste documento.**
 
---
 
## 2. Padronização de Nomenclatura
 
### 2.1 Requisitos Funcionais (RF)
 
Requisitos funcionais descrevem **o que o sistema deve fazer** — suas funcionalidades, comportamentos e respostas a entradas do usuário.
 
**Formato:** `[RF` + número sequencial com três dígitos + `]`
 
| Identificador | Descrição resumida           |
|---------------|------------------------------|
| `[RF001]`     | Primeiro requisito funcional |
| `[RF002]`     | Segundo requisito funcional  |
| `[RF010]`     | Décimo requisito funcional   |
 
**Regras de numeração:**
- A numeração começa em `RF001` e é sempre **sequencial e crescente**.
- Nunca reutilize um identificador, mesmo que um requisito seja removido. Requisitos removidos devem ser marcados como `[REMOVIDO]` e mantidos no histórico de versões.
- Requisitos de módulos diferentes **não reiniciam a numeração** — a sequência é global para o documento.
---
 
### 2.2 Requisitos Não Funcionais (RNF)
 
Requisitos não funcionais descrevem **como o sistema deve se comportar** — restrições de qualidade como desempenho, segurança, usabilidade e conformidade.
 
**Formato:** `[RNF` + número sequencial com três dígitos + `]`
 
| Identificador | Categoria     | Descrição resumida               |
|---------------|---------------|----------------------------------|
| `[RNF001]`    | Usabilidade   | Interface intuitiva              |
| `[RNF002]`    | Segurança     | Autenticação de usuários via JWT |
| `[RNF003]`    | Padrões       | Conformidade a boas práticas     |
 
**Regras de numeração:** As mesmas do RF — sequência global, sem reutilização, sem reinício por categoria.
 
---
 
### 2.3 Atores
 
Os atores do sistema devem ser nomeados de forma padronizada e consistente em **todo** o documento. Os atores reconhecidos para o projeto Guardião da Cozinha são:
 
| Nome no documento | Perfil de acesso                                    |
|-------------------|-----------------------------------------------------|
| `Administrador`   | Gerencia produtos (cadastrar, atualizar, excluir)   |
| `Operador`        | Registra movimentações de entrada e saída           |
| `Gestor`          | Consulta relatórios e indicadores de estoque        |
| `Sistema`         | Ações automáticas sem intervenção humana direta     |
 
> Os nomes dos atores devem ser escritos **sempre com a primeira letra maiúscula** e nunca abreviados.
 
---
 
## 3. Regras de Especificação de Requisitos
 
As regras abaixo derivam dos atributos de qualidade de uma boa especificação de requisitos, conforme apresentado por Rogério Magela.
 
---
 
### Regra 1 — Completude
 
> **Todo requisito deve estar completamente especificado, sem lacunas ou informações faltantes.**
 
Um requisito está **incompleto** quando:
 
- Não descreve todas as entradas necessárias para que o sistema execute a função.
- Não descreve a saída ou resultado esperado após a execução.
- Não define o comportamento do sistema em situações de erro ou exceção.
- Usa expressões indefinidas como *"etc."*, *"entre outros"*, *"quando necessário"* ou *"de alguma forma"*.
**❌ Exemplo incorreto:**
 
```
[RF005] Registrar Entrada
O usuário informa os dados e o sistema atualiza o estoque etc.
```
 
**✅ Exemplo correto:**
 
```
[RF005] Registrar Entrada de Produto
Ator: Operador
Entradas: Produto (obrigatório), Quantidade (obrigatório, inteiro positivo), Data (obrigatório, formato DD/MM/AAAA)
Saídas: Confirmação de registro; estoque do produto atualizado com a nova quantidade somada.
Fluxo alternativo: Se a quantidade informada for zero ou negativa, o sistema exibe mensagem de erro
                   e não realiza o registro.
Prioridade: Essencial
```
 
---
 
### Regra 2 — Consistência
 
> **Os requisitos não podem se contradizer entre si nem com outros documentos do projeto.**
 
Um requisito está **inconsistente** quando:
 
- Dois requisitos definem comportamentos opostos para a mesma situação.
- Um requisito usa um termo com sentido diferente do que outro requisito usa para o mesmo termo.
- Um requisito cita um ator que não está definido na seção de Descrição dos Usuários.
- Um requisito referencia outro (`[RF00X]`) que não existe no documento.
**❌ Exemplo incorreto:**
 
```
[RF004] Excluir Produto
Ator: Operador       ← inconsistente: exclusão é responsabilidade do Administrador
 
[RF001] Cadastrar Produto
Ator: Administrador  ← correto
```
 
**✅ Forma de resolver:** revisar todos os atores e garantir que as responsabilidades definidas na seção *Descrição dos Usuários* (Capítulo 1) sejam respeitadas em todos os requisitos.
 
---
 
### Regra 3 — Não-Ambiguidade
 
> **Cada requisito deve ter uma única interpretação possível. Linguagem vaga, subjetiva ou duplo-sentido é proibida.**
 
Expressões **proibidas** em requisitos:
 
| Expressão proibida         | Motivo                                      | Substitua por                              |
|----------------------------|---------------------------------------------|--------------------------------------------|
| "o sistema deve ser rápido" | "rápido" é subjetivo                        | "o sistema deve responder em até 2 segundos" |
| "interface amigável"       | "amigável" não é mensurável                 | descreva comportamentos concretos de usabilidade |
| "dados relevantes"         | não especifica quais dados                  | liste os campos exatos                     |
| "quando possível"          | cria incerteza sobre obrigatoriedade        | "sempre que" ou "somente se"               |
| "usuário comum"            | ator não definido no documento              | "Operador" (conforme seção de atores)      |
 
**❌ Exemplo incorreto:**
 
```
[RF008] Gerar Relatório de Estoque
O gestor poderá, quando achar necessário, ver os dados do estoque de forma clara.
```
 
**✅ Exemplo correto:**
 
```
[RF008] Gerar Relatório de Estoque
Ator: Gestor
Entradas: Filtros opcionais — Categoria, Período (data inicial e data final), Validade
Saídas: Relatório exibido em tela contendo: nome do produto, categoria, quantidade atual,
        data de validade e status (normal / baixo estoque / vencido).
        O relatório pode ser exportado em formato PDF.
Prioridade: Importante
```
 
---
 
### Regra 4 — Verificabilidade
 
> **Todo requisito deve ser testável. Deve ser possível criar um teste objetivo que confirme se o requisito foi ou não implementado corretamente.**
 
Um requisito **não é verificável** quando não existe nenhum critério objetivo para determinar se foi atendido. Em geral, requisitos ambíguos (Regra 3) também não são verificáveis.
 
**Critério prático:** ao ler o requisito, a equipe de testes deve conseguir responder: *"O que eu executo e o que eu espero ver como resultado?"*
 
**❌ Exemplo incorreto:**
 
```
[RNF001] O sistema deve ser seguro.
```
> Impossível de testar: o que é "seguro"? Qualquer nível de segurança satisfaz esse requisito?
 
**✅ Exemplo correto:**
 
```
[RNF002] Autenticação de Usuários
O sistema deve exigir login com e-mail e senha para acesso a qualquer funcionalidade.
Senhas devem ter no mínimo 8 caracteres, contendo letras e números.
Após 5 tentativas de login malsucedidas consecutivas, a conta deve ser bloqueada
por 15 minutos.
Prioridade: Essencial
```
> Testável: é possível criar casos de teste para cada critério (tentativas, bloqueio, regras de senha).
 
---
 
### Regra 5 — Rastreabilidade
 
> **Todo requisito deve ter origem identificável e deve ser possível rastreá-lo do documento de requisitos até o código e os testes.**
 
Isso significa:
 
- Cada requisito deve referenciar a **necessidade ou regra de negócio** que o originou (ex.: evitar desperdício, rastrear responsáveis pelas movimentações).
- Quando um requisito for alterado, **todos os requisitos que dependem dele** devem ser revisados e atualizados.
- Referências cruzadas entre requisitos devem usar o identificador formal: `[RF00X]` ou `[RNF00X]`.
**Exemplo de referência cruzada correta:**
 
```
[RNF002] Autenticação de Usuários
...
Caso(s) de uso associado(s): [RF007] Relacionar Usuário à Movimentação
```
 
**Tabela de rastreabilidade** (deve ser mantida e atualizada a cada versão do documento):
 
| Requisito | Módulo / Funcionalidade        | Depende de       |
|-----------|-------------------------------|------------------|
| RF001     | Gerenciamento de Produtos      | —                |
| RF002     | Gerenciamento de Produtos      | RF001            |
| RF005     | Gerenciamento de Movimentações | RF001, RNF002    |
| RF006     | Gerenciamento de Movimentações | RF001, RNF002    |
| RF007     | Gerenciamento de Movimentações | RNF002           |
| RF008     | Relatórios e Indicadores       | RF005, RF006     |
| RF009     | Relatórios e Indicadores       | RF007            |
| RNF002    | Segurança                      | —                |
 
---
 
## 4. Padronização da Estrutura de Cada Requisito
 
Todo requisito funcional escrito no documento **deve** conter os campos abaixo, nesta ordem e com estes rótulos exatos:
 
```
[RFXXX] <Nome do Requisito em Título>
 
Ator:          <nome do ator conforme seção 2.3>
Entradas:      <lista dos dados de entrada com tipo e obrigatoriedade>
Saídas:        <resultado ou efeito produzido pelo sistema>
Fluxo principal: <descrição passo a passo da operação normal>
Fluxo alternativo: <comportamento em caso de erro ou exceção — se aplicável>
Prioridade:    ( ) Essencial  ( ) Importante  ( ) Desejável
```
 
Todo requisito não funcional deve conter:
 
```
[RNFXXX] <Nome do Requisito em Título>
 
Descrição:     <descrição objetiva e verificável da restrição ou qualidade exigida>
Caso(s) de uso associado(s): <identificadores dos RFs relacionados, ou "Todos">
Prioridade:    ( ) Essencial  ( ) Importante  ( ) Desejável
```
 
---
 
## 5. Checklist de Verificação
 
Antes de submeter qualquer requisito ao documento oficial, o autor deve marcar **todos** os itens abaixo:
 
- [ ] O identificador segue o padrão `[RFXXX]` ou `[RNFXXX]` com numeração sequencial correta.
- [ ] O requisito está **completo**: possui todos os campos obrigatórios preenchidos (Regra 1).
- [ ] O requisito não **contradiz** nenhum outro requisito existente no documento (Regra 2).
- [ ] O ator citado está definido na seção *Descrição dos Usuários* (seção 2.3 deste documento).
- [ ] O requisito não contém linguagem vaga, subjetiva ou com duplo sentido (Regra 3).
- [ ] É possível escrever pelo menos um caso de teste objetivo para este requisito (Regra 4).
- [ ] Referências cruzadas a outros requisitos usam o identificador formal (Regra 5).
- [ ] A tabela de rastreabilidade foi atualizada para incluir este requisito.
---
 
> **Referência:** MAGELA, Rogério. *Engenharia de Software*. Cap. 1 — Especificação de Requisitos.  
> Documento mantido pela equipe do projeto Guardião da Cozinha — versão 1.0, Junho de 2026.
 
