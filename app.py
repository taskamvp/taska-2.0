import tkinter as tk
from tkinter import messagebox, filedialog
import json
import os
from copy import deepcopy

class StudentListConverter:
    def __init__(self, root):
        self.root = root
        self.root.title("Student List Converter")
        self.root.geometry("800x600")

        # Load data
        with open("taska-45011-default-rtdb-export-16.json", "r") as f:
            self.firebase_data = json.load(f)
        with open("manualstudentlist.json", "r") as f:
            self.manual_template = json.load(f)[0]  # Use first entry as template

        # Filter students with more than just email
        self.students = self.filter_students()
        self.current_index = 0
        self.selected_students = []

        # GUI Elements
        self.label_count = tk.Label(root, text="Profiles Added: 0", font=("Arial", 12))
        self.label_count.pack(pady=10)

        self.text_display = tk.Text(root, height=20, width=80, font=("Arial", 10))
        self.text_display.pack(pady=10)
        self.text_display.config(state='disabled')

        self.btn_frame = tk.Frame(root)
        self.btn_frame.pack(pady=10)

        self.btn_add = tk.Button(self.btn_frame, text="Add Profile", command=self.add_profile)
        self.btn_add.pack(side=tk.LEFT, padx=5)

        self.btn_skip = tk.Button(self.btn_frame, text="Skip Profile", command=self.skip_profile)
        self.btn_skip.pack(side=tk.LEFT, padx=5)

        self.btn_save = tk.Button(self.btn_frame, text="Save JSON", command=self.save_json)
        self.btn_save.pack(side=tk.LEFT, padx=5)

        # Display first student if available
        if self.students:
            self.display_student()

    def filter_students(self):
        """Filter students with more than just an email in personal data."""
        students = []
        for student_id, data in self.firebase_data.get("studentslist", {}).items():
            personal = data.get("personal", {})
            # Check if personal has more than just email
            if len(personal) > 1 or any(k != "email" for k in personal.keys()):
                students.append((student_id, data))
        return students

    def display_student(self):
        """Display the current student's data in the text box."""
        if self.current_index >= len(self.students):
            messagebox.showinfo("Done", "All profiles processed!")
            self.text_display.config(state='normal')
            self.text_display.delete(1.0, tk.END)
            self.text_display.insert(tk.END, "No more profiles to process.")
            self.text_display.config(state='disabled')
            self.btn_add.config(state='disabled')
            self.btn_skip.config(state='disabled')
            return

        student_id, student_data = self.students[self.current_index]
        self.text_display.config(state='normal')
        self.text_display.delete(1.0, tk.END)
        self.text_display.insert(tk.END, f"Student ID: {student_id}\n\n")
        self.text_display.insert(tk.END, json.dumps(student_data, indent=2))
        self.text_display.config(state='disabled')

    def map_to_manual_format(self, student_id, student_data):
        """Map Firebase student data to manualstudentlist.json format."""
        # Create a deep copy of the template to avoid modifying it
        new_entry = deepcopy(self.manual_template)
        new_entry["id"] = student_id

        # Map personal details
        personal = student_data.get("personal", {})
        new_entry["personal"]["name"] = personal.get("name", "")
        new_entry["personal"]["email"] = personal.get("email", "")
        new_entry["personal"]["gender"] = ""  # Not available in Firebase data
        new_entry["personal"]["location"] = personal.get("location", "")
        new_entry["personal"]["linkedin"] = ""  # Not available
        new_entry["personal"]["whatsapp"] = personal.get("whatsapp", "")
        new_entry["personal"]["profilePic"] = personal.get("profileImage", "")

        # Map education details
        education = student_data.get("education", {})
        new_entry["education"]["college"] = education.get("college", "")
        new_entry["education"]["degree"] = education.get("degree", "")
        new_entry["education"]["branch"] = education.get("branch", "")
        new_entry["education"]["year"] = education.get("year", "").replace("1st", "First").replace("2nd", "Second").replace("3rd", "Third").replace("4th", "Fourth").replace("5th", "Fifth")

        # Map skills
        skills = student_data.get("skills", "")
        new_entry["skills"] = skills if skills else ""

        # Experience (not directly available, use about as proxy)
        new_entry["experience"] = f"Worked on {personal.get('about', '').lower()}" if personal.get("about") else ""

        # Availability (not available, set defaults)
        new_entry["availability"]["hours"] = "20"
        new_entry["availability"]["worktime"] = "Flexible"
        new_entry["availability"]["remote"] = "Yes"
        new_entry["availability"]["duration"] = "3 months"

        # Portfolio
        new_entry["portfolio"] = student_data.get("portfolio", [])

        # Preferences (set defaults)
        new_entry["preferences"]["roles"] = ""
        new_entry["preferences"]["why"] = ""

        # Soft skills (set defaults)
        new_entry["softSkills"]["communication"] = "Good"
        new_entry["softSkills"]["deadlines"] = "Good"

        # Profiles
        profiles = student_data.get("profiles", {})
        new_entry["profiles"]["github"]["username"] = profiles.get("github", {}).get("username", "")
        new_entry["profiles"]["codeforces"]["username"] = profiles.get("codeforces", {}).get("username", "")
        new_entry["profiles"]["leetcode"]["username"] = profiles.get("leetcode", {}).get("username", "")

        # About
        about = personal.get("about", "")
        new_entry["about"] = f"{personal.get('name', '')} is a {new_entry['education']['year']}-year {new_entry['education']['degree']} student in {new_entry['education']['branch']} at {new_entry['education']['college']}. Skilled in {new_entry['skills']}, with experience in {new_entry['experience']}. Interested in the role of {new_entry['preferences']['roles']}, {personal.get('name', '')} is available for {new_entry['availability']['hours']} hours per week, primarily during {new_entry['availability']['worktime'].lower()}. Remote work: {new_entry['availability']['remote']}."

        return new_entry

    def add_profile(self):
        """Add the current profile to the selected list after confirmation."""
        if self.current_index >= len(self.students):
            return

        student_id, student_data = self.students[self.current_index]
        if messagebox.askyesno("Confirm", f"Add profile for {student_data.get('personal', {}).get('name', student_id)}?"):
            mapped_data = self.map_to_manual_format(student_id, student_data)
            self.selected_students.append(mapped_data)
            self.label_count.config(text=f"Profiles Added: {len(self.selected_students)}")
            self.current_index += 1
            self.display_student()

    def skip_profile(self):
        """Skip the current profile."""
        if self.current_index >= len(self.students):
            return
        self.current_index += 1
        self.display_student()

    def save_json(self):
        """Save the selected students to a JSON file."""
        if not self.selected_students:
            messagebox.showwarning("Warning", "No profiles selected to save!")
            return

        file_path = filedialog.asksaveasfilename(
            defaultextension=".json",
            filetypes=[("JSON files", "*.json")],
            initialfile="manualstudentlist.json"
        )
        if file_path:
            with open(file_path, "w") as f:
                json.dump(self.selected_students, f, indent=4)
            messagebox.showinfo("Success", f"JSON file saved to {file_path}")

if __name__ == "__main__":
    root = tk.Tk()
    app = StudentListConverter(root)
    root.mainloop()