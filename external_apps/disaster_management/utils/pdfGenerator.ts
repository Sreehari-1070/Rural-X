import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SimulationResult, FieldInput } from '@/store/useDisasterStore';

export const generatePDFReport = (result: SimulationResult, fieldData: FieldInput, mapImage?: string) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Disaster Management Drainage Report", 14, 22);

    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 14, 30);

    // Section 1: Field Parameters
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("1. Field Parameters", 14, 45);

    autoTable(doc, {
        startY: 50,
        head: [['Parameter', 'Value']],
        body: [
            ['Field Dimensions', `${fieldData.field_length}m x ${fieldData.field_width}m`],
            ['Soil Type', fieldData.soil_type],
            ['Rainfall Intensity', fieldData.rainfall_intensity],
            ['Current Water Depth', `${fieldData.water_depth} cm`],
            ['Disaster Scenario', fieldData.disaster_type?.replace('_', ' ').toUpperCase() || 'HEAVY RAINFALL']
        ],
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] }
    });

    // Section 2: Analysis Results
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("2. Drainage Analysis", 14, finalY);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Metric', 'Result']],
        body: [
            ['Recommended Strategy', result.drainage_type],
            ['Risk Level', result.risk_level.toUpperCase()],
            ['Expected Drain Time', `${result.expected_drain_time_minutes} minutes`],
            ['Total Channels Needed', `${result.drain_channels.length}`]
        ],
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
    });

    // Section 3: Action Plan
    // Section 3: Visual Map
    let finalY2 = (doc as any).lastAutoTable.finalY + 15;

    if (mapImage) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("3. Drainage Map Layout", 14, finalY2);

        try {
            doc.addImage(mapImage, 'PNG', 14, finalY2 + 5, 180, 100);
            finalY2 += 115;
        } catch (e) {
            console.error("Failed to add image to PDF", e);
            doc.text("[Map Image Failed to Load]", 14, finalY2 + 10);
            finalY2 += 20;
        }
    }

    // Section 4: Execution Plan
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(mapImage ? "4. Execution Plan" : "3. Execution Plan", 14, finalY2);

    doc.setFontSize(11);
    doc.setTextColor(60);
    const text = `Based on the simulation, it is recommended to implement the ${result.drainage_type}. All channels should be dug with a minimum width of 1m. Ensure all outlets are clear of debris. `;

    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 14, finalY2 + 10);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Powered by Smart Crop Disaster Simulator", 14, 280);

    doc.save("drainage_report.pdf");
};
