import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
          <span className="text-2xl font-bold text-text-primary tracking-tight">NextFlow</span>
        </div>

        <SignUp
          appearance={{
            variables: {
              colorBackground: "#12121a",
              colorInputBackground: "#1a1a26",
              colorInputText: "#f4f4f8",
              colorText: "#f4f4f8",
              colorTextSecondary: "#9999bb",
              colorPrimary: "#7c3aed",
              colorDanger: "#ef4444",
              borderRadius: "0.5rem",
            },
            elements: {
              card: "shadow-2xl border border-border",
              formButtonPrimary: "bg-primary hover:bg-primary-hover",
            },
          }}
        />
      </div>
    </div>
  );
}
