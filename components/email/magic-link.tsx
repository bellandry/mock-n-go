import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkProps {
  name?: string;
  magicLink?: string;
}

export const MagicLink = ({ name, magicLink }: MagicLinkProps) => {
  const previewText = `Your magic link to access Creavvy`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <img
              src="https://mockngo.laclass.dev/logo.png"
              width="120"
              height="36"
              alt="Mock & Go"
            />
          </Section>
          <Heading style={h1}>Your Magic Link</Heading>
          <Text style={text}>Hello {name || "there"},</Text>
          <Text style={text}>
            We received a request for a magic link to access your Mock & Go
            account.
          </Text>
          <Section style={buttonContainer}>
            <Link href={magicLink} style={button}>
              Login to Mock & Go
            </Link>
          </Section>
          <Text style={text}>
            This link will expire in 1 hour. If you didn&#39;t request this
            link, you can safely ignore this email.
          </Text>
          <Text style={text}>
            Best regards,
            <br />
            The Mock & Go Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

MagicLink.PreviewProps = {
  name: "Mock & Go",
  magicLink: "https://creavvy.com/magic-link?token=abc123",
} as MagicLinkProps;

export default MagicLink;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 25px 48px",
  backgroundImage: 'url("/assets/raycast-bg.png")',
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat, no-repeat",
};

const logoContainer = {
  margin: "0 auto",
  padding: "20px 0",
  textAlign: "center" as const,
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const buttonContainer = {
  margin: "24px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#EC333C",
  borderRadius: "25px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};
