class Order {
  constructor(
    public address: string,
    public number: number,
    public optionalAddress: string,
    public dinheiro: number,
    public numeroCartao: string,
    public codigoCartao: string,
    public vencimentoCartao: string,
    public paymentOption: any[] = [],
    public orderItems: OrderItem[] = []
  ){}
}

class OrderItem {
  constructor(public quantity: number, public menuId: string){}
}

export {Order, OrderItem}
