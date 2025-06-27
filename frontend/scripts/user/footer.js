fetch("components/footer.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("footer-container").innerHTML = html;
  })
  .catch(err => console.error("Erreur chargement footer :", err));
