function getComplaints() {
  return JSON.parse(localStorage.getItem("complaints")) || [];
}

function saveComplaints(data) {
  localStorage.setItem("complaints", JSON.stringify(data));
}

// MOCK AI
function generateAI() {
  const categories = ["Water Issue", "Garbage", "Road Damage"];
  const category = categories[Math.floor(Math.random() * categories.length)];

  return {
    category,
    aiConfidence: Math.floor(Math.random() * 20) + 80,
    status: "Pending",
    priority: Math.random() > 0.7 ? "Critical" : "Normal",
    estimatedTime: "1-2 days"
  };
}

// SUBMIT
function submitComplaint() {
  const complaint = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    location: document.getElementById("location").value,
    name: document.getElementById("name").value,
    contact: document.getElementById("contact").value,
    image: document.getElementById("image").value,
    ...generateAI()
  };

  let data = getComplaints();
  data.push(complaint);
  saveComplaints(data);

  alert("Complaint Submitted!");
  window.location.href = "dashboard.html";
}

// DASHBOARD
function loadDashboard() {
  const data = getComplaints();

  let total = data.length;
  let pending = data.filter(c => c.status === "Pending").length;
  let critical = data.filter(c => c.priority === "Critical").length;

  document.getElementById("stats").innerHTML = `
    <p>Total: ${total}</p>
    <p>Pending: ${pending}</p>
    <p>Critical: ${critical}</p>
  `;

  let html = "";

  data.forEach((c, index) => {
    html += `
      <div class="complaint">
        <h4>${c.title}</h4>
        <p>${c.description}</p>
        <p><b>Location:</b> ${c.location}</p>
        <p><b>Category:</b> ${c.category}</p>
        <p><b>AI Confidence:</b> ${c.aiConfidence}%</p>
        <p class="${c.priority === 'Critical' ? 'critical' : ''}">
          ${c.priority}
        </p>

        <select onchange="updateStatus(${index}, this.value)">
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      </div>
    `;
  });

  document.getElementById("complaints").innerHTML = html;
}

// UPDATE STATUS
function updateStatus(index, status) {
  let data = getComplaints();
  data[index].status = status;
  saveComplaints(data);
  loadDashboard();
}