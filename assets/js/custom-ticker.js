document.addEventListener('DOMContentLoaded', () => {
  const tickerTextElement = document.getElementById('tickerText');
  if (!tickerTextElement) {
    console.warn('Ticker text element not found.');
    return;
  }

  const messages = [
    "Este material foi gerado por IA.",
    "Explore os exemplos práticos.",
    "Dúvidas? Abra uma issue no GitHub!"
  ];
  let currentMessageIndex = 0;
  
  // Duração da animação em ms (deve corresponder ao CSS: 15s)
  const animationDuration = 15000; 
  // Pausa entre o fim de uma mensagem e o início da próxima
  const delayBetweenMessages = 2000; // 2 segundos

  function displayNextMessage() {
    // 1. Remove a classe de animação para resetar o estado (se existir)
    tickerTextElement.classList.remove('scrolling');
    
    // 2. Força um reflow. Isso é crucial para garantir que o navegador processe
    // a remoção da classe ANTES de tentar re-adicioná-la para reiniciar a animação.
    void tickerTextElement.offsetWidth;

    // 3. Define o novo texto da mensagem
    tickerTextElement.textContent = messages[currentMessageIndex];
    
    // 4. Adiciona a classe para (re)iniciar a animação.
    // Um pequeno timeout aqui pode ajudar em alguns navegadores a garantir que o texto foi atualizado
    // e o reflow aconteceu antes da animação recomeçar.
    setTimeout(() => {
      if (tickerTextElement) { // Verifica novamente se o elemento existe no escopo do timeout
         tickerTextElement.classList.add('scrolling');
      }
    }, 50); // 50ms é geralmente suficiente

    // 5. Atualiza o índice para a próxima mensagem
    currentMessageIndex = (currentMessageIndex + 1) % messages.length;

    // 6. Agenda a próxima chamada desta função após a animação atual terminar + a pausa.
    setTimeout(displayNextMessage, animationDuration + delayBetweenMessages);
  }

  if (messages.length > 0 && tickerTextElement) {
    // Inicia o ciclo de exibição das mensagens
    displayNextMessage();
  } else if (messages.length === 0) {
    console.warn('No messages provided for the ticker.');
  }
}); 