import React from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ cart, removeFromCart }) {
  const navigate = useNavigate();

  // Calcular o total de cada item e o valor total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-blue-600">Finalização do Pedido</h2>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">
            Seu carrinho está vazio. Adicione itens para continuar.
          </p>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b">Itens no Pedido</h3>
            <ul className="mb-6 border-b pb-4">
              {cart.map((item, index) => (
                <li key={index} className="flex justify-between items-center mb-3">
                  <div className="flex flex-col">
                    <span className="text-lg font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm text-gray-500">
                      Quantidade: {item.quantity} - Unitário: R${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-green-600 mr-4">
                      R${(item.price * item.quantity).toFixed(2)} {/* Mostrando valor total do item */}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.name)} // Usando removeFromCart para excluir
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between font-semibold text-xl text-gray-800 mt-4">
              <span>Total:</span>
              <span className="text-green-600">R${calculateTotal().toFixed(2)}</span>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition w-full"
              >
                Voltar para o Início
              </button>

              <button
                onClick={() => alert("Pedido Finalizado!")}
                className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition w-full"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
