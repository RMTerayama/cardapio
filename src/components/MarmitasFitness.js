import React, { useState } from 'react';

function MarmitasFitness({ addToCart }) {
  const options = [
    { key: 'frango', name: 'Marmita de Frango Grelhado', description: 'Frango grelhado acompanhado de arroz integral e brócolis no vapor.', price: 35.0, imageUrl: 'https://via.placeholder.com/400x250' },
    { key: 'carne', name: 'Marmita de Carne de Sol', description: 'Carne de sol acompanhada de feijão verde e arroz.', price: 40.0, imageUrl: 'https://via.placeholder.com/400x250' },
    { key: 'vegana', name: 'Marmita Vegana', description: 'Arroz integral, legumes e tofu grelhado.', price: 30.0, imageUrl: 'https://via.placeholder.com/400x250' },
    { key: 'peixe', name: 'Marmita de Peixe', description: 'Filé de peixe grelhado com arroz integral e salada.', price: 38.0, imageUrl: 'https://via.placeholder.com/400x250' },
    { key: 'vegetariana', name: 'Marmita Vegetariana', description: 'Arroz integral com legumes no vapor e molho pesto.', price: 32.0, imageUrl: 'https://via.placeholder.com/400x250' },
    { key: 'tofu', name: 'Marmita de Tofu', description: 'Tofu grelhado com legumes ao molho teriyaki.', price: 33.0, imageUrl: 'https://via.placeholder.com/400x250' },
  ];

  // Estado para controlar a quantidade de cada Marmita
  const [quantities, setQuantities] = useState(
    options.reduce((acc, option) => {
      acc[option.key] = 0;
      return acc;
    }, {})
  );

  // Estado para o popup de sucesso
  const [showPopup, setShowPopup] = useState(false);

  const increment = (item) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item]: prevQuantities[item] + 1,
    }));
  };

  const decrement = (item) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [item]: Math.max(0, prevQuantities[item] - 1),
    }));
  };

  const handleAddToCart = (itemKey) => {
    const quantity = quantities[itemKey];
    if (quantity > 0) {
      const item = options.find(option => option.key === itemKey);
      const totalPrice = item.price;

      // Adiciona ou atualiza o item no carrinho
      addToCart(item.name, quantity, totalPrice);

      // Exibe o popup de sucesso por 3 segundos
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);

      // Zera a quantidade local após adicionar ao carrinho
      setQuantities({
        ...quantities,
        [itemKey]: 0,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8 m-[8vw] sm:m-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Cardápio de Marmitas Fitness</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        {options.map((option) => (
          <div
            key={option.key}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300"
          >
            <img src={option.imageUrl} alt={option.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">{option.name}</h2>
              <p className="text-gray-600 mt-2">{option.description}</p>
              <p className="text-gray-800 font-bold mt-2">R$ {option.price.toFixed(2)}</p>
              <div className="flex items-center mt-4 space-x-2">
                <button
                  onClick={() => decrement(option.key)}
                  className="px-3 py-1 bg-gray-300 rounded-l hover:bg-gray-400 transition"
                >
                  -
                </button>
                <span className="px-4 py-1 border-t border-b text-center">{quantities[option.key]}</span>
                <button
                  onClick={() => increment(option.key)}
                  className="px-3 py-1 bg-gray-300 rounded-r hover:bg-gray-400 transition"
                >
                  +
                </button>
                <button
                  onClick={() => handleAddToCart(option.key)}
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

export default MarmitasFitness;
