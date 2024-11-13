import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaStreetView, FaCity, FaBuilding, FaSave } from 'react-icons/fa';
import InputMask from 'react-input-mask';

function Checkout({ cart, removeFromCart }) {
  const navigate = useNavigate();

  // Estado para controlar a seleção de "Entrega" ou "Retirada"
  const [deliveryOption, setDeliveryOption] = useState(localStorage.getItem('deliveryOption') || '');
  const [address, setAddress] = useState(
    JSON.parse(localStorage.getItem('address')) || { cep: '', street: '', neighborhood: '', number: '' }
  );
  const [total, setTotal] = useState(calculateTotal());
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false); // Controle da visibilidade do formulário de endereço
  const [paymentMethod, setPaymentMethod] = useState(localStorage.getItem('paymentMethod') || ''); // Estado para armazenar a forma de pagamento
  const [changeAmount, setChangeAmount] = useState(localStorage.getItem('changeAmount') || ''); // Estado para armazenar o valor de troco

  // Função para calcular o total dos itens
  function calculateTotal() {
    const itemTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    // Se for entrega, adiciona R$ 8 ao valor total, se for retirada, não adiciona nada
    return deliveryOption === 'Entrega' ? itemTotal + 8 : itemTotal;
  }

  // Função para lidar com a mudança na opção de entrega
  const handleDeliveryChange = (event) => {
    const selectedOption = event.target.value;
    setDeliveryOption(selectedOption);
    localStorage.setItem('deliveryOption', selectedOption); // Salvar no localStorage
    setTotal(calculateTotal()); // Atualiza o total após mudar a opção
    if (selectedOption === 'Retirada') {
      setAddress({ cep: '', street: '', neighborhood: '', number: '' }); // Limpar o endereço ao mudar para "Retirada"
      localStorage.removeItem('address'); // Remover o endereço armazenado
    }
  };

  // Função para buscar o endereço a partir do CEP (API gratuita)
  const handleCepChange = async (event) => {
    const cep = event.target.value;
    setAddress((prevAddress) => ({
      ...prevAddress,
      cep
    }));

    if (cep.length === 10) {  // Agora considera o formato do CEP com máscara
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        const data = await response.json();
        if (data.logradouro && data.bairro) {
          setAddress({
            cep: cep,
            street: data.logradouro,
            neighborhood: data.bairro,
            number: address.number // mantém o número que já foi inserido
          });
        }
      } catch (error) {
        console.error('Erro ao buscar o endereço:', error);
      }
    }
  };

  // Função para navegar para a revisão do pedido
  const handleNext = () => {
    localStorage.setItem('paymentMethod', paymentMethod);
    localStorage.setItem('changeAmount', changeAmount);
    localStorage.setItem('total', total);
    navigate('/review-order');
  };

  // Função para mostrar o formulário de endereço
  const handleAddAddressClick = () => {
    setIsAddressFormVisible(true);
  };

  // Função para salvar o endereço no localStorage
  const handleSaveAddress = () => {
    localStorage.setItem('address', JSON.stringify(address)); // Salvar endereço no localStorage
    setIsAddressFormVisible(false); // Fecha o formulário de endereço
  };

  // Função para alterar o endereço
  const handleEditAddress = () => {
    setIsAddressFormVisible(true); // Abre o formulário de endereço
  };

  // Função para excluir item do carrinho
  const handleRemoveItem = (itemName) => {
    removeFromCart(itemName);
    setTotal(calculateTotal()); // Atualiza o total após exclusão
  };

  // Função para lidar com a mudança na opção de pagamento
  const handlePaymentChange = (event) => {
    const selectedPaymentMethod = event.target.value;
    setPaymentMethod(selectedPaymentMethod);
  };

  // Função para lidar com o campo de troco
  const handleChangeAmountChange = (event) => {
    setChangeAmount(event.target.value);
  };

  // Armazenar os itens do pedido no localStorage
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart)); // Armazena o carrinho
    }
  }, [cart]);

  useEffect(() => {
    setTotal(calculateTotal()); // Atualiza o total quando o carrinho muda
  }, [cart, deliveryOption]);

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
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b">Itens do Pedido</h3>
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
                      R${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.name)} // Atualiza o total após remoção
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </li>
              ))}
              {/* Adicionando valor de entrega como item do pedido */}
              {deliveryOption === 'Entrega' && (
                <li className="flex justify-between items-center mb-3 font-semibold text-gray-800">
                  <div className="flex flex-col">
                    <span className="text-lg">Valor de Entrega</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg text-red-600">R$ 8,00</span>
                  </div>
                </li>
              )}
            </ul>

            <div className="flex justify-between font-semibold text-xl text-gray-800 mt-4">
              <span>Total:</span>
              <span className="text-green-600">R${total.toFixed(2)}</span>
            </div>

            {/* Seleção de entrega ou retirada */}
            <div className="mt-6">
              <label className="block text-lg font-medium text-gray-800">Escolha a forma de recebimento:</label>
              <div className="mt-2">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="Retirada"
                    checked={deliveryOption === 'Retirada'}
                    onChange={handleDeliveryChange}
                    className="mr-2"
                  />
                  Retirada
                </label>
                <label>
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="Entrega"
                    checked={deliveryOption === 'Entrega'}
                    onChange={handleDeliveryChange}
                    className="mr-2"
                  />
                  Entrega
                </label>
              </div>
            </div>

            {/* Endereço, visível apenas se "Entrega" for escolhido */}
            {deliveryOption === 'Entrega' && (
              <div className="mt-6">
                {address.cep ? (
                  <div className="mb-4">
                    <p className="text-lg font-medium text-gray-800">Endereço:</p>
                    <div className="flex flex-col">
                      <span>{address.street}</span>
                      <span>{address.neighborhood}</span>
                      <span>{address.cep}</span>
                      <span>{address.number}</span>
                    </div>
                    <button
                      onClick={handleEditAddress}
                      className="text-blue-500 hover:underline mt-2"
                    >
                      Editar Endereço
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-medium text-gray-800">Informe o endereço:</span>
                    <button
                      onClick={handleAddAddressClick}
                      className="text-blue-500 hover:underline ml-2"
                    >
                      Adicionar endereço
                    </button>
                  </div>
                )}
                {isAddressFormVisible && (
                  <div className="mt-4">
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-800">CEP:</label>
                      <InputMask
                        mask="99999-999"
                        value={address.cep}
                        onChange={handleCepChange}
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-800">Rua:</label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-800">Bairro:</label>
                      <input
                        type="text"
                        value={address.neighborhood}
                        onChange={(e) =>
                          setAddress({ ...address, neighborhood: e.target.value })
                        }
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-lg font-medium text-gray-800">Número:</label>
                      <input
                        type="text"
                        value={address.number}
                        onChange={(e) =>
                          setAddress({ ...address, number: e.target.value })
                        }
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleSaveAddress}
                      className="w-full px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Salvar Endereço
                    </button>
                  </div>
                )}
              </div>
            )}

           {/* Forma de pagamento */}
<div className="mt-6">
  <label className="block text-lg font-medium text-gray-800">Forma de Pagamento:</label>
  <div className="mt-2">
    <label className="mr-4">
      <input
        type="radio"
        name="paymentMethod"
        value="Cartão de Crédito"
        checked={paymentMethod === 'Cartão de Crédito'}
        onChange={handlePaymentChange}
        className="mr-2"
      />
      Cartão de Crédito
    </label>
    <label className="mr-4">
      <input
        type="radio"
        name="paymentMethod"
        value="Cartão de Débito"
        checked={paymentMethod === 'Cartão de Débito'}
        onChange={handlePaymentChange}
        className="mr-2"
      />
      Cartão de Débito
    </label>
    <label className="mr-4">
      <input
        type="radio"
        name="paymentMethod"
        value="Dinheiro"
        checked={paymentMethod === 'Dinheiro'}
        onChange={handlePaymentChange}
        className="mr-2"
      />
      Dinheiro
    </label>
    <label>
      <input
        type="radio"
        name="paymentMethod"
        value="Pix"
        checked={paymentMethod === 'Pix'}
        onChange={handlePaymentChange}
        className="mr-2"
      />
      Pix
    </label>
  </div>

  {/* Campo de troco, visível apenas se "Dinheiro" for escolhido */}
  {paymentMethod === 'Dinheiro' && (
    <div className="mt-4">
      <label className="block text-lg text-gray-800">Troco para quantos?</label>
      <input
        type="number"
        value={changeAmount}
        onChange={handleChangeAmountChange}
        className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="Valor"
      />
    </div>
  )}
</div>


            {/* Botão para continuar para a revisão do pedido */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleNext}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
