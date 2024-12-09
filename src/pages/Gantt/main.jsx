import React, { useEffect, useState } from 'react'
import { Button, Card } from "antd"
import { Gantt } from '../../../libs/gantt-chart-for-react';
import "../../../libs/gantt-chart-for-react/dist/index.css";
import frame from "../../../public/assets/images/icons/Frame.png"
import back from "../../../public/assets/images/icons/chevron-left-svgrepo-com.svg"
import prev from "../../../public/assets/images/icons/chevron-right-svgrepo-com.svg"
import Download from "../../../public/assets/images/icons/download-svgrepo-com.svg"
import { getGanttChartData } from '../../services';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { projectList } from '../Projects/project.service';
import { useLocation } from 'react-router-dom';

import "./Gantt.css"
import { currentTimestamp } from '../../components/common/service';

function Ganttchart() {
	const { state } = useLocation();
	const [error, setError] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [ganttData, setGanttData] = useState([]);
	const [project, setProject] = useState(state?.project);
	const [tasks, setTasks] = useState([]);


	useEffect(() => {
		if (project?.project_id) {
			fetchGanttData();
		}
	}, [project]);

	const fetchGanttData = async () => {
		try {
			const data = await getGanttChartData(project.project_id);
			if (data && data.projectCategories) {
				setGanttData(data);
			} else {
				setError("Invalid data format");
			}
		} catch (error) {
			setError(error.message);
		}
	};

	const openPopup = () => {
		setIsOpen(true);
	};

	const closePopup = () => {
		setIsOpen(false);
	};

	const handleExpanderClick = (task) => {
		setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
	};


	const getEarliestAndLatestDates = (tasks, projectStartDate, projectEndDate) => {
		if (tasks.length > 0) {
			let earliestStartDate = tasks[0].task_start_date;
			let latestEndDate = tasks[0].task_end_date;

			tasks.forEach((task) => {
				if (new Date(task.task_start_date) < new Date(earliestStartDate)) {
					earliestStartDate = task.task_start_date;
				}
				if (new Date(task.task_end_date) > new Date(latestEndDate)) {
					latestEndDate = task.task_end_date;
				}
			});

			return { start: new Date(earliestStartDate), end: new Date(latestEndDate) };
		}
		return { start: new Date(projectStartDate?.getFullYear(), projectStartDate?.getMonth(), projectStartDate?.getDate()), end: new Date(projectEndDate?.getFullYear(), projectEndDate?.getMonth(), projectEndDate?.getDate()) };
	};

	useEffect(() => {
		if (tasks.length < 1) {
			let key = 0;
			const taskData = ganttData?.projectCategories?.reduce((acc, row) => {
				const projectStartDate = new Date(ganttData?.project_start_date);
				const projectEndDate = new Date(ganttData?.project_end_date);
			  
				let totalProgress = 0;
				let totalCount = 0;
			  
				// Push category data with progress: 0 and store the index
				const categoryIndex = acc.length;
				acc.push({
				  key: key,
				  ...getEarliestAndLatestDates(row?.ref_category?.Tasks, projectStartDate, projectEndDate),
				  name: row?.ref_category?.category_name,
				  id: row?.ref_category?.category_id,
				  progress: 0, // Initialize progress to 0
				  type: "project",
				  hideChildren: false
				});
			  
				key++;
			  
				if (row?.ref_category?.Tasks.length > 0) {
				  row?.ref_category?.Tasks.forEach((task) => {
					const taskStartDate = task?.task_start_date ? new Date(task.task_start_date) : new Date("2020-02-25T00:00:00.000Z");
					const taskEndDate = task?.task_end_date ? new Date(task.task_end_date) : new Date();
					const taskProgress = task?.percentage || 0;
			  
					acc.push({
					  key: key,
					  start: taskStartDate,
					  end: taskEndDate,
					  name: task.task_name,
					  id: task.task_id,
					  progress: taskProgress,
					  type: "task",
					  project: row?.ref_category?.category_id,
					  isChild: true,
					});
			  
					totalProgress += taskProgress;
					totalCount++;
					key++;
			  
					if (task?.subtasks?.length > 0) {
					  task?.subtasks.forEach((sub_task) => {
						const subTaskStartDate = sub_task?.task_start_date ? new Date(sub_task.task_start_date) : new Date("2020-02-25T00:00:00.000Z");
						const subTaskEndDate = sub_task?.task_end_date ? new Date(sub_task.task_end_date) : new Date();
						const subTaskProgress = sub_task?.percentage || 0;
			  
						acc.push({
						  key: key,
						  start: subTaskStartDate,
						  end: subTaskEndDate,
						  name: sub_task.task_name,
						  id: sub_task.task_id,
						  progress: subTaskProgress,
						  type: "task",
						  project: row?.ref_category?.category_id,
						  isGrandChild: true,
						});
			  
						totalProgress += subTaskProgress;
						totalCount++;
						key++;
					  });
					}
				  });
				}
			  
				// Calculate average progress for the category
				const averageProgress = totalCount > 0 ? totalProgress / totalCount : 0;
			  
				// Update the category progress
				acc[categoryIndex].progress = parseFloat(averageProgress?.toFixed(2));
			  
				return acc;
			  }, []);
			  
			  console.log(taskData);
			  
			// const taskData = ganttData?.projectCategories?.reduce((acc, category) => {
			// 	const processTasks = (tasks, parentKey) => {
			// 		tasks.forEach((task,index) => {
			// 			const taskData = {
			// 				key:`${task.task_id}_${index}`,
			// 				start: task.task_start_date ? new Date(task.task_start_date) : new Date("2020-02-25T00:00:00.000Z"),
			// 				end: task.task_end_date ? new Date(task.task_end_date) : new Date(),
			// 				name: task.task_name ? task.task_name : "Unnamed Task",
			// 				id: task.task_id,
			// 				type:"project",
			// 				progress: 100,
			// 				isDisabled: false,
			// 				styles: { progressColor: '#08A0F7', progressSelectedColor: '#ff9e0d' }
			// 			};

			// 			if (parentKey) {
			// 				taskData.parentKey = parentKey;
			// 			}

			// 			acc.push(taskData);

			// 			if (task.subtasks && task.subtasks.length > 0) {
			// 				processTasks(task.subtasks, task.task_id);
			// 			}
			// 		});
			// 	};

			// 	const categoryData = {
			// 		key: category.project_category_id,
			// 		start: category.project_start_date ? new Date(category.project_start_date) : new Date("2020-02-25T00:00:00.000Z"),
			// 		end: category.project_end_date ? new Date(category.project_end_date) : new Date(),
			// 		name: category.ref_category.category_name ? category.ref_category.category_name : "Unnamed Category",
			// 		id: category.project_category_id,
			// 		type: 'project',
			// 		progress: 100,
			// 		isDisabled: true,
			// 		styles: { progressColor: '#08A0F7', progressSelectedColor: '#ff9e0d' },
			// 		className: 'category-name',
			// 		isMainTask: true,
			// 		hideChildren: true
			// 	};

			// 	acc.push(categoryData);

			// 	if (category.ref_category?.Tasks) {
			// 		processTasks(category.ref_category.Tasks);
			// 	}

			// 	return acc;
			// }, []);
			console.log(taskData)
			setTasks(taskData ? taskData : []);
		}
	}, [ganttData]);

	const exportToPDF = () => {
		const outerDiv = document.querySelector("._3eULf");

		const originalOverflow = outerDiv.style.overflow;
		const originalHeight = outerDiv.style.height;

		outerDiv.style.overflow = "visible";
		outerDiv.style.height = "auto";
		outerDiv.style.width = "auto";
		var contentWidth = outerDiv.scrollWidth;
		outerDiv.style.width = contentWidth + "px";

		setTimeout(() => {
			html2canvas(outerDiv, {
				scrollY: -window.scrollY,
				scrollX: -window.scrollX,
				scale: 2,
				useCORS: true,
				logging: true,
			})
				.then((canvas) => {
					const imgData = canvas.toDataURL("image/png");
					const pdf = new jsPDF("landscape");
					const pdfWidth = pdf.internal.pageSize.getWidth();
					const pdfHeight = pdf.internal.pageSize.getHeight();

					// Scale the image to fit within the PDF dimensions
					const imgWidth = pdfWidth;
					const imgHeight = (canvas.height * pdfWidth) / canvas.width;

					if (imgHeight <= pdfHeight) {
						pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
					} else {
						const scaleRatio = pdfHeight / imgHeight;
						const scaledWidth = imgWidth * scaleRatio;
						const scaledHeight = imgHeight * scaleRatio;
						pdf.addImage(imgData, "PNG", 0, 0, scaledWidth, scaledHeight);
					}

					pdf.save(
						`${project?.project_name || ganttData.project_name
						}-gantt-chart-${currentTimestamp()}.pdf`
					);

					outerDiv.style.overflow = originalOverflow;
					outerDiv.style.height = originalHeight;
					setIsOpen(false);
				})
				.catch((error) => {
					console.error("Error generating PDF:", error);
					outerDiv.style.overflow = originalOverflow;
					outerDiv.style.height = originalHeight;
					setIsOpen(false);
				});
		}, 100);
	};





	return (
		<>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<h3 className="m-2 ">
					{project?.project_name || ganttData.project_name}
				</h3>
				<div className="flex ">
					{/* <div className='m-2 p-3 border rounded border-solid'><img src={back} alt='{back}' /></div>
					<div className='m-2 p-3 border rounded border-solid'><img src={prev} alt='{prev}' /></div> */}
					<div className="m-2 p-3 " onClick={openPopup}>
						<img src={frame} alt="dots" />
					</div>
					{isOpen && (
						<div className="fixed inset-0  flex items-center justify-center z-50">
							<div className="fixed inset-0 bg-black opacity-50"></div>
							<div className="relative bg-white p-6 rounded-lg shadow-xl z-50 min-w-max">
								<div
									className="absolute top-0 right-0 m-3 text-gray-600 hover:text-gray-900 bg-white "
									onClick={closePopup}
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								</div>
								<div className="m-2">
									<p className="text-gray-700 text-center">
										<b>
											Download
											<span className="mx-2">
												<img src={Download} alt="Download" />
											</span>
										</b>
									</p>
									<Button onClick={exportToPDF}>Export to PDF</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<div id="test" className="test overflow-scroll w-full h-full">
				{tasks && tasks.length > 0 && (
					<Gantt
						tasks={tasks}
						viewMode={"Week"}
						headerHeight={"100"}
						listCellWidth={"400px"}
						ganttHeight="100"
						barCornerRadius={5}
						barFill={20}
						onExpanderClick={handleExpanderClick}
					/>
				)}
			</div>
		</>
	);
}

export default Ganttchart