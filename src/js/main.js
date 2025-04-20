import { includeHTML } from './include.js'


includeHTML('header', 'src/components/header.html').then(() => {
  import('./header.js')
})

includeHTML('#home', 'src/components/home.html').then(() => {
  import('./home.js')
})

includeHTML('#about', 'src/components/about.html').then(() => {
  import('./about.js')
})

includeHTML('#service', 'src/components/service.html').then(() => {
  import('./service.js')
})

includeHTML('#contact', 'src/components/contact.html').then(() => {
  import('./contact.js')
})



includeHTML('footer', 'src/components/footer.html')
