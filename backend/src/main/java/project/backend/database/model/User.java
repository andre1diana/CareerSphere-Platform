package project.backend.database.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import project.backend.database.enums.Roles;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private String name;

    private String email;

    private String password;

    private Roles role;

    private int age;

    private String profilePictureUrl;

    private LocalDateTime createdAt;

    private String phoneNumber;

    private String address;

    @ElementCollection
    private List<String> skills;

    private String qualification;

    private String bio;

    private Boolean isActive;

    private String title;
    private String location;
    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserExperience> experience;
    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<UserEducation> education;

    public void setBio(String bio) {
        this.bio = bio;
    }

    public User(String name, String email, String password, Roles role, LocalDateTime createdAt) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }
    public User(String name, String email, String password, Roles role, LocalDateTime createdAt, int age, String profilePicture, String phoneNumber, String address, List<String> skills, String qualification, String bio, Boolean isActive) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
        this.age = age;
        this.profilePictureUrl = profilePicture;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.skills = skills;
        this.qualification = qualification;
        this.bio = bio;
        this.isActive = isActive;
    }
    public User() {
        // Default constructor
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getBio() {
        return bio;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public List<String> getSkills() {
        return skills;
    }

    public String getQualification() {
        return qualification;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(Roles role) {
        this.role = role;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePictureUrl = profilePicture;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Roles getRole() {
        return role;
    }

    public int getAge() {
        return age;
    }

    public String getProfilePicture() {
        return profilePictureUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<UserExperience> getExperience() {
        return experience;
    }

    public void setExperience(List<UserExperience> experience) {
        this.experience = experience;
    }

    public List<UserEducation> getEducation() {
        return education;
    }

    public void setEducation(List<UserEducation> education) {
        this.education = education;
    }
}
