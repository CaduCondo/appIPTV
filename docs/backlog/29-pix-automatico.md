---
titulo: Pix automático: gerar, confirmar pagamento e liberar o plano
labels: tipo:feature, prioridade:p3, estado:backlog, area:infra
---
## Contexto
O usuário escolhe plano e telas, recebe um Pix, o sistema confirma o pagamento pelo aviso assinado do provedor e libera sozinho; o administrador é avisado. Planos empilham.

## Critérios de aceitação (BDD)
- **Dado** um Pix pago, **quando** o aviso do provedor chega assinado, **então** o plano é liberado.
- **Dado** um aviso sem assinatura válida, **quando** chega, **então** é recusado.
