<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $date = $_POST['date'];
    $time = $_POST['time'];

    // Set recipient email addresses
    $to = "recipient@example.com"; // Replace with the email where the form should be sent
    $copy = "ciesiolkabizsolutions@gmail.com";

    // Email subject and message
    $subject = "New Meeting Scheduled";
    $message = "
    Name: $name\n
    Email: $email\n
    Date: $date\n
    Time: $time\n
    ";

    // Email headers
    $headers = "From: $email";

    // Send email to recipient
    if (mail($to, $subject, $message, $headers)) {
        // Send a copy to ciesiolkabizsolutions@gmail.com
        mail($copy, $subject, $message, $headers);

        echo "Meeting scheduled successfully!";
    } else {
        echo "Error: Unable to send email.";
    }
}
?>
