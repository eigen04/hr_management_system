package com.hr_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${frontend.url}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("BISAG-N HR System - Password Reset Request");
        message.setText("Dear User,\n\n" +
                "You requested a password reset for your BISAG-N HR Management System account.\n" +
                "Please click the following link to reset your password:\n" +
                frontendUrl + "/reset-password?token=" + token + "\n\n" +
                "This link will expire in 1 hour. If you did not request a password reset, please ignore this email.\n\n" +
                "Best regards,\nBISAG-N Team");
        message.setFrom(fromEmail);
        mailSender.send(message);
    }

    public void sendSignupConfirmationEmail(String toEmail, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("BISAG-N HR System - Signup Request Submitted");
        message.setText("Dear " + fullName + ",\n\n" +
                "Your signup request for the BISAG-N HR Management System has been successfully submitted.\n" +
                "It is currently awaiting approval from our HR team. You will be notified once your account is reviewed.\n\n" +
                "Best regards,\nBISAG-N Team");
        message.setFrom(fromEmail);
        mailSender.send(message);
    }
    public void sendHrSignupConfirmationEmail(String toEmail, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("BISAG-N HR System - HR Signup Request Submitted");
        message.setText("Dear " + fullName + ",\n\n" +
                "Your HR signup request for the BISAG-N HR Management System has been successfully submitted.\n" +
                "It is currently awaiting approval from our admin team. You will be notified once your HR account is reviewed.\n\n" +
                "Best regards,\nBISAG-N Team");
        message.setFrom(fromEmail);
        mailSender.send(message);
    }

    public void sendSignupApprovalEmail(String toEmail, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("BISAG-N HR System - Account Approved");
        message.setText("Dear " + fullName + ",\n\n" +
                "Congratulations! Your account for the BISAG-N HR Management System has been approved.\n" +
                "You can now log in using your credentials at: " + frontendUrl + "\n\n" +
                "Best regards,\nBISAG-N Team");
        message.setFrom(fromEmail);
        mailSender.send(message);
    }

    public void sendSignupRejectionEmail(String toEmail, String fullName, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("BISAG-N HR System - Account Request Rejected");
        message.setText("Dear " + fullName + ",\n\n" +
                "We regret to inform you that your signup request for the BISAG-N HR Management System has been rejected.\n" +
                "Reason: " + reason + "\n\n" +
                "If you have any questions, please contact our HR team.\n\n" +
                "Best regards,\nBISAG-N Team");
        message.setFrom(fromEmail);
        mailSender.send(message);
    }
    public void sendProfileRejectionEmail(String toEmail, String fullName, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("BISAG-N HR System - Action Required on Your Profile Submission");
        message.setText("Dear " + fullName + ",\n\n" +
                "Your recent profile submission has been reviewed but could not be approved at this time. All previously uploaded documents have been removed from the system.\n\n" +
                "Reason for rejection: " + reason + "\n\n" +
                "Please log in to the portal to correct your information and re-upload the necessary documents.\n" +
                "Portal Link: " + frontendUrl + "\n\n" +
                "Best regards,\nBISAG-N Team");
        message.setFrom(fromEmail);
        mailSender.send(message);
    }
    public void sendProfileUpdateAllowedEmail(String toEmail, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("BISAG-N HR System - Your Profile Update Request was Approved");
        message.setText("Dear " + fullName + ",\n\n" +
                "Your request to update your profile has been approved by HR.\n" +
                "Your profile form is now unlocked. Please log in to the portal to make your changes and resubmit for verification.\n\n" +
                "Portal Link: " + frontendUrl + "\n\n" +
                "Best regards,\nBISAG-N Team");
        message.setFrom(fromEmail);
        mailSender.send(message);
    }

    public void sendReportingPersonChangeEmail(String toEmail, String employeeFullName, String newManagerFullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Important: Update to Your Reporting Structure");
        message.setText("Dear " + employeeFullName + ",\n\n" +
                "This is to inform you that there has been an update to your reporting structure within the BISAG-N HR Management System.\n\n" +
                "Your new reporting person is now: " + newManagerFullName + "\n\n" +
                "This change has been made by the HR department and is effective immediately. No action is required from your side.\n\n" +
                "Best regards,\nBISAG-N Team");
        message.setFrom(fromEmail);
        mailSender.send(message);
    }
}