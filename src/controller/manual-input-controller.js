// src/controller/manual-input-controller.js
import prisma from '../application/database.js';
import parkingService from '../service/parking-service.js'; // Import parking service

const updateRecord = async (req, res) => {
  const { recordId, newPlate } = req.body;

  try {
    const intRecordId = parseInt(recordId, 10);
    // Update the license plate for the selected record
    const updatedRecord = await prisma.parking_in.update({
      where: { id: intRecordId },
      data: { platNomor: newPlate }, // Update the license plate
    });

    // Call the function to process the updated record
    await parkingService.processUpdatedRecord(updatedRecord); // New processing logic

    res.status(200).json({ message: 'Record updated successfully.' });
  } catch (error) {
    console.error(`Error updating record: ${error.message}`);
    res.status(500).json({ message: 'Failed to update record.' });
  }
};

export default {
  updateRecord,
};