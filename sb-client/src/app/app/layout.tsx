"use client";
import { Sidebar, Stack } from "@components";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import "twin.macro";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div tw="flex h-[100dvh]">
				<div>
					<Sidebar />
				</div>
				<div tw="flex-grow flex flex-col h-[100dvh] relative">
					<div>
						<Stack />
					</div>
					<div tw="flex-grow overflow-y-auto">
						{/* rowl tambah p-2 */}
						<div tw="p-2.5">{children}</div>
						<ToastContainer
							position="bottom-right"
							autoClose={2000}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
							theme="colored"
						/>
					</div>
					<div id="modal-popup" />
				</div>
			</div>
		</>
	);
}
