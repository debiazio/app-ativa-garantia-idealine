## Fluxo de ativação de garantia

O fluxo da aplicação funciona em 4 etapas:

1. **Dados do equipamento**
   - valida o número de série pela rota `/_v/garantia/serial/:serial`
   - exibe a descrição do produto quando o serial é encontrado

2. **Dados pessoais**
   - coleta nome, e-mail, CPF e telefone
   - aplica validações de preenchimento e formato

3. **Endereço**
   - consulta o CEP
   - preenche automaticamente o endereço
   - permite informar número, complemento e referência

4. **Canal de compra**
   - coleta o canal de compra
   - ao clicar em **Finalizar**, envia os dados para a rota `/_v/garantia/ativacao`

## Persistência dos dados

Ao finalizar o formulário, o backend:

- recebe os dados do cadastro
- consulta a base oficial de seriais
- identifica `descricaoProduto`, `codigoItem` e `dataLancamentoPedido`
- calcula os campos de garantia
- grava o registro no Master Data, na entidade `GA`

## Regras de datas

A aplicação considera as seguintes regras:

- `dataAtivacao` = data atual em que o cadastro é realizado no site
- `dataEmissaoNotaFiscal` = `DataLancamentoPedido + 1 dia`
- `dataInicioGarantia` = igual a `dataEmissaoNotaFiscal`

## Regras de validade da garantia

A validade é calculada com base na `descricaoProduto`:

- se contiver `BELLINHA` → **2 anos**
- se contiver `LA BELLE` → **2 anos**
- se contiver `COPO/HASTE/SEPARADOR` → **2 anos**
- caso contrário → **1 ano**

## Regra de status

O campo `status` é calculado automaticamente:

- `ativa` → quando a garantia ainda está dentro do prazo
- `expirada` → quando a `dataValidade` já passou

## Integração com Master Data

Os dados são gravados na entidade `GA` do Master Data com campos como:

- `serial`
- `descricaoProduto`
- `codigoItem`
- `nome`
- `email`
- `cpf`
- `telefone`
- `cep`
- `endereco`
- `numero`
- `complemento`
- `canalCompra`
- `dataAtivacao`
- `dataEmissaoNotaFiscal`
- `dataInicioGarantia`
- `dataValidade`
- `regraGarantiaAplicada`
- `status`
- `origemCadastro`
- `workspace`

## Tratamento de erros no frontend

Mensagens técnicas do backend não devem ser exibidas diretamente para o usuário.

Quando ocorre falha na validação do serial ou na finalização do cadastro:

- o usuário vê apenas uma mensagem amigável
- o detalhe técnico fica disponível apenas no console
