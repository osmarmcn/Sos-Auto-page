


function initializeAlert() {
    const alertContainer = document.getElementById('alert-container');
    
    if (!alertContainer) {
      console.error('Elemento de alerta não encontrado');
      return;
    }
    
    
    alertContainer.style.display = 'block';
    
    
    setTimeout(() => {
      alertContainer.classList.add('hide-alert');
      
      
      setTimeout(() => {
        if (alertContainer.parentNode) {
          alertContainer.parentNode.removeChild(alertContainer);
        } else {
          alertContainer.style.display = 'none';
        }
      }, 300)
    }, 4500)
  }
  
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAlert);
  } else {
    initializeAlert()
  }
  
  
  export default function showAlert() {
    initializeAlert();
  }