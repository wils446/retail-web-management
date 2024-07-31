"use client";
import { ClientSideStoreProvider } from "@libs/redux";
import GlobalStyles from "app/GlobalStyles";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export const ClientRootLayout: React.FC<{ children: React.ReactNode }> = (props) => {
	return (
		<html lang="en">
			<head>
				<title>Sinar Bangunan</title>
			</head>
			<body className={poppins.className}>
				<ClientSideStoreProvider>
					<GlobalStyles />
					{props.children}
				</ClientSideStoreProvider>
			</body>
		</html>
	);
};
