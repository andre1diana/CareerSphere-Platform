# Job Recruitment Platform – Web Technologies Project

This web application is a job recruitment platform (inspired by LinkedIn), designed to help recent university graduates find their place in the job market in a smooth and enjoyable way. It enables direct interaction with employers and offers a user-friendly experience while tracking market trends and job opportunities.

---

## 🧩 Project Pages

1. **Login Page** – user authentication.
2. **Signup Page** – account creation.
3. **Dashboard (Home)** – the main landing page featuring company highlights, personalized job suggestions, and user stats.
4. **User Profile Page** – contains user information, education, experience, and notifications.
5. **Admin Panel** – admin-only section for managing users and job postings.
6. **Job Listings Page** – complete list of available jobs with filters.
7. **Job Details Page** – detailed view of a selected job + apply button for eligible users.
8. **Settings Page** – user account settings.
9. **Contact Page** – available in the footer.

---

## 👥 User Roles

### Guest
- Can view job listings.
- Can view employer profiles.
- Must sign up or log in to apply for jobs.

### User / Applicant (Employee)
- Can view and apply for jobs.
- Can view employer profiles.
- Can edit their own profile and upload a resume.

### Employer
- Can create job postings.
- Can view all aplications for a job

### Admin
- Manages and verifies employer posts.
- Handles user-reported issues (e.g. false information, spam job offers).
- Has access to platform statistics and administrative tools.

---

## 🔄 Usage Scenario

- The user logs in from the **Login Page**.
- After authentication, they are redirected to the **Home Dashboard**, where a welcome panel and user role badge are shown.
- A gallery of **Most Popular Companies This Week** is displayed along with other job suggestions.
- On the **Profile Page**, users can edit their information using pre-filled editable fields (initially empty for fast loading).
- On the **Jobs Page**, users can use filters to refine job results. Filters apply after clicking the **Apply Filters** button.
- Clicking **View Details** opens a new page with extended job information. Only applicants (employees) will see the **Apply Now** button.
- A floating **Chat Button** is available on all pages, located at the bottom right.
- The **Contact Page** can be accessed via the footer.

---

## ⚙️ Technologies Used

### Frontend
- HTML
- CSS (Bootstrap)
- JavaScript
- React

---

## 📦 Dependencies

- Node.js
- npm

---

## 🚀 Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/andre1diana/CareerSphere-frontend.git
   cd CareerSphere-frontend/frontend
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

---

## 📁 Code Structure

### public:
Contains images for the Dashboard gallery and index.html (default created with npm). The tab image has been customized.

### src:
Contains multiple folders:

1. **assets** – Contains all images used in the project (logo, default profile picture, etc.)

2. **components** – Contains all components displayed on the page based on user role, including RoutesComponent where all application routes are defined

3. **context** – Files that save the application context in local storage to maintain functionalities such as login state and component display

4. **pages** – All application pages

5. **styles** – Contains styles used in pages

6. **App.js** – The main component of the project containing contexts and routes to pages
