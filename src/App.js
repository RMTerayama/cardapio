import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import YakissobaOptions from './components/Yakissoba'; 
import MarmitasFitness from './components/MarmitasFitness'; 
import Checkout from './components/Checkout'; 

function App() {
  const [cart, setCart] = useState([]);

  // Função para adicionar itens ao carrinho
  const addToCart = (itemName, quantity, price) => {
    const updatedCart = [...cart];
    const itemIndex = updatedCart.findIndex((item) => item.name === itemName);
  
    if (itemIndex !== -1) {
      updatedCart[itemIndex].quantity += quantity; // Incrementa a quantidade
    } else {
      updatedCart.push({ name: itemName, quantity, price }); // Armazena o preço unitário
    }
  
    console.log('Carrinho atualizado:', updatedCart);  // Verificando se o carrinho está correto
    setCart(updatedCart); // Atualiza o carrinho
  };
  
  
  

  // Função para excluir item do carrinho
  const removeFromCart = (itemName) => {
    const updatedCart = cart.filter((item) => item.name !== itemName);
    setCart(updatedCart); // Atualiza o carrinho após excluir o item
  };

  return (
    <Router>
      <Navbar cart={cart} setCart={setCart} />
      
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/yakissoba" element={<YakissobaOptions addToCart={addToCart} />} />
          <Route path="/marmitas-fitness" element={<MarmitasFitness addToCart={addToCart} />} />
          <Route 
            path="/checkout" 
            element={<Checkout cart={cart} removeFromCart={removeFromCart} />} 
          /> {/* Passando removeFromCart para o Checkout */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
