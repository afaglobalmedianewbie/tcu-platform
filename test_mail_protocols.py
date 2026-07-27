import smtplib
import imaplib
import poplib
import ssl

USER = 'admin@topclassuniversal.co.id'
PASS = 'admin123'

def test_smtp():
    print("=== Testing SMTP (Port 25) ===")
    try:
        smtp = smtplib.SMTP('127.0.0.1', 25, timeout=5)
        print("Connected to SMTP")
        ehlo_resp = smtp.ehlo()
        print("EHLO response:", ehlo_resp)
        if smtp.has_extn('starttls'):
            print("STARTTLS supported. Upgrading connection...")
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            smtp.starttls(context=context)
            smtp.ehlo()
        print("Attempting login...")
        smtp.login(USER, PASS)
        print("SMTP LOGIN SUCCESSFUL!")
        smtp.quit()
    except Exception as e:
        print("SMTP FAILED:", str(e))

def test_imap():
    print("\n=== Testing IMAP (Port 143) ===")
    try:
        imap = imaplib.IMAP4('127.0.0.1', 143)
        print("Connected to IMAP")
        if 'STARTTLS' in imap.capabilities:
            print("STARTTLS supported. Upgrading connection...")
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            imap.starttls(ssl_context=context)
        print("Attempting login...")
        imap.login(USER, PASS)
        print("IMAP LOGIN SUCCESSFUL!")
        imap.logout()
    except Exception as e:
        print("IMAP FAILED:", str(e))

def test_pop3():
    print("\n=== Testing POP3 (Port 110) ===")
    try:
        pop = poplib.POP3('127.0.0.1', 110, timeout=5)
        print("Connected to POP3")
        print("Welcome message:", pop.getwelcome())
        # Try STLS if supported (POP3 usually uses STLS)
        try:
            print("Attempting STLS...")
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            pop.stls(context=context)
            print("STLS connection upgraded")
        except Exception as stls_err:
            print("STLS not supported or failed:", str(stls_err))
        print("Attempting login...")
        pop.user(USER)
        pop.pass_(PASS)
        print("POP3 LOGIN SUCCESSFUL!")
        pop.quit()
    except Exception as e:
        print("POP3 FAILED:", str(e))

if __name__ == '__main__':
    test_smtp()
    test_imap()
    test_pop3()
