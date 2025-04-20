export async function includeHTML(selector, file) {
    const element = document.querySelector(selector)
    if (!element) return
  
    try {
      const res = await fetch(file)
      const html = await res.text()
      element.innerHTML = html
      return Promise.resolve()
    } catch (err) {
      console.error(`Erro ao incluir ${file}:`, err)
    }
  }
  