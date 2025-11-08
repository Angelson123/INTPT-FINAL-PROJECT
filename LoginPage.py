def validate_email(email):
    """
    Validates if the email ends with @gmail.com.
    Returns True if valid, False otherwise.
    """
    if not email.endswith('@gmail.com'):
        print("incorrect email")
        return False
    return True

def validate_contact(contact):
    """
    Validates if the contact number is only digits and at most 11 characters.
    Returns True if valid, False otherwise.
    """
    if not contact.isdigit() or len(contact) > 11:
        print("invalid contact number")
        return False
    return True

def login(name=None, email=None, contact=None, submit_type=None):
    """
    Simulates the login process by taking user inputs and validating them.
    If arguments are provided, use them; otherwise, prompt for input.
    """
    if name is None:
        name = input("Name: ")
    if email is None:
        email = input("Email: ")
    if contact is None:
        contact = input("Contact Number: ")
    if submit_type is None:
        submit_type = input("Submit as 'user' or 'admin': ").lower()
    else:
        submit_type = submit_type.lower()

    # Validate email first
    if not validate_email(email):
        return  # Don't proceed

    # Validate contact
    if not validate_contact(contact):
        return  # Don't proceed

    # Check submit type
    if submit_type == 'admin':
        if email != 'admin123@gmail.com':
            print("sorry you are not the admin")
            return  # Don't proceed
        else:
            print("Admin login successful!")
    else:
        print("User login successful!")

if __name__ == "__main__":
    login()
