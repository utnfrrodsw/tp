<script>
  export default {
    mounted() {
      this.logout()
    },
    methods: {
      logout() {
        try {
          localStorage.removeItem('token')
          this.$router.push('/login')
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>
