function handleSubmit(e) {
  e.preventDefault();
  alert("Employee added successfully!");
  window.location.href = "index.ftl";
}

function cancelForm() {
  window.location.href = "index.ftl";
}
