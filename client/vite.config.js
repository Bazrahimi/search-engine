import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/graphql': {
        target: 'https://rocky-refuge-26561-7a3129f4ca70.herokuapp.com',
        changeOrigin: true,
        secure: false,
      },     
    }
  }
})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: true,

//     proxy: {
//       '/graphql': {
//         target: 'http://localhost:3001',
//         changeOrigin: true,
//         secure: false,
//       },     
//     }
//   }
// })