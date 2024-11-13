import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ReviewOrder() {
  const navigate = useNavigate();

  // Recupera os dados do pedido armazenados no localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const deliveryOption = localStorage.getItem('deliveryOption');
  const address = JSON.parse(localStorage.getItem('address')) || {};
  const paymentMethod = localStorage.getItem('paymentMethod');
  const changeAmount = localStorage.getItem('changeAmount');

  // Função para formatar o valor de dinheiro
  const formatCurrency = (value) => `R$ ${value.toFixed(2)}`;

  // Função para calcular o total do pedido (itens + taxa de entrega)
  const calculateTotal = () => {
    const itemTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = deliveryOption === 'Entrega' ? 8 : 0; // Taxa de entrega
    return itemTotal + deliveryFee;
  };

  const [total, setTotal] = useState(calculateTotal());

  // Atualizar o total ao carregar o componente
  useEffect(() => {
    setTotal(calculateTotal());
  }, [cart, deliveryOption]); // Recalcular sempre que o carrinho ou a opção de entrega mudar

  // Função para exibir os itens do pedido
  const renderCartItems = () => {
    return cart.map((item, index) => (
      <li key={index} className="flex justify-between items-center mb-3">
        <div className="flex flex-col">
          <span className="text-lg font-medium text-gray-800">{item.name}</span>
          <span className="text-sm text-gray-500">
            Quantidade: {item.quantity} - Unitário: {formatCurrency(item.price)}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-green-600 mr-4">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </li>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-blue-600">Revisão do Pedido</h2>

        <div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b">Itens do Pedido</h3>
          <ul className="mb-6 border-b pb-4">
            {renderCartItems()}
            {deliveryOption === 'Entrega' && (
              <li className="flex justify-between items-center mb-3 font-semibold text-gray-800">
                <div className="flex flex-col">
                  <span className="text-lg">Valor de Entrega</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg text-red-600">{formatCurrency(8)}</span> {/* Fixe o valor de entrega */}
                </div>
              </li>
            )}
          </ul>

          <div className="flex justify-between font-semibold text-xl text-gray-800 mt-4">
            <span>Total:</span>
            <span className="text-green-600">{formatCurrency(total)}</span> {/* Total recalculado */}
          </div>

          {deliveryOption === 'Entrega' && (
            <div className="mt-6">
              <p className="text-lg font-medium text-gray-800">Endereço:</p>
              <p>{address.street}, {address.neighborhood}, {address.number}</p>
            </div>
          )}

          <div className="mt-6">
            <p className="text-lg font-medium text-gray-800">Forma de Pagamento: {paymentMethod}</p>
            {paymentMethod === 'Dinheiro' && (
              <p className="text-lg text-gray-800">Troco para: R$ {changeAmount}</p>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/checkout')}
              className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition w-full"
            >
              Voltar para o Pedido
            </button>

            <button
              onClick={() => {
                // Aqui você pode implementar a lógica para finalizar o pedido, como salvar no backend, etc.
                alert("Pedido Finalizado!");
              }}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition w-full"
            >
              Finalizar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewOrder;
