import React, { useState } from 'react';
import ycarne from './img/carne.png';
import ysalmao from './img/salmao.png';
import ymisto from './img/misto.png';
import yporco from './img/porco.png';
import yvegetariano from './img/vegetariano.png';
import yfrango from './img/frango.png';

function YakissobaOptions({ addToCart }) {
  const options = [
    { name: 'Yakissoba Vegetariano', ingredients: 'Macarrão, Repolho, Cenoura, Brócolis, Pimentão', imageUrl: yvegetariano, price: 20.0 },
    { name: 'Yakissoba de Frango', ingredients: 'Macarrão, Frango, Repolho, Cenoura, Brócolis', imageUrl: yfrango, price: 25.0 },
    { name: 'Yakissoba de Carne Bovina', ingredients: 'Macarrão, Carne, Repolho, Cenoura, Brócolis', imageUrl: ycarne, price: 30.0 },
    { name: 'Yakissoba de Carne de Porco', ingredients: 'Macarrão, Copa Lombo, Repolho, Cenoura, Brócolis', imageUrl: yporco, price: 27.0 },
    { name: 'Yakissoba Misto', ingredients: 'Macarrão, Frango, Carne Bovina, Repolho, Cenoura, Brócolis', imageUrl: ymisto, price: 32.0 },
    { name: 'Yakissoba de Salmão', ingredients: 'Macarrão, Salmão Grelhado, Repolho, Cenoura, Brócolis', imageUrl: ysalmao, price: 35.0 },
  ];

  // Estado para controlar a quantidade de cada Yakissoba
  const [quantities, setQuantities] = useState(
    options.reduce((acc, option) => {
      acc[option.name] = 0;
      return acc;
    }, {})
  );

  // Estado para o popup de sucesso
  const [showPopup, setShowPopup] = useState(false);

  const increment = (item) => {
    setQuantities({
      ...quantities,
      [item]: quantities[item] + 1,
    });
  };

  const decrement = (item) => {
    setQuantities({
      ...quantities,
      [item]: Math.max(0, quantities[item] - 1),
    });
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item];
    if (quantity > 0) {
      const totalPrice = options.find(option => option.name === item).price;
      
      // Adiciona ou atualiza o item no carrinho
      addToCart(item, quantity, totalPrice);

      // Exibe o popup de sucesso por 3 segundos
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

      // Zera a quantidade local após adicionar ao carrinho
      setQuantities({
        ...quantities,
        [item]: 0,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8 m-[8vw] sm:m-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Escolha seu Yakissoba</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <img
              src={option.imageUrl}
              alt={option.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{option.name}</h2>
              <p className="text-gray-600">{option.ingredients}</p>
              <p className="text-gray-800 font-bold mt-2">R$ {option.price.toFixed(2)}</p>
              <div className="flex items-center mt-4 space-x-2">
                <button
                  onClick={() => decrement(option.name)}
                  className="px-3 py-1 bg-gray-300 rounded-l hover:bg-gray-400 transition"
                >
                  -
                </button>
                <span className="px-4 py-1 border-t border-b text-center">{quantities[option.name]}</span>
                <button
                  onClick={() => increment(option.name)}
                  className="px-3 py-1 bg-gray-300 rounded-r hover:bg-gray-400 transition"
                >
                  +
                </button>
                <button
                  onClick={() => handleAddToCart(option.name)}
                  className="ml-4 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 transition"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup de sucesso */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg">
          Item adicionado ao carrinho!
        </div>
      )}
    </div>
  );
}

export default YakissobaOptions;
