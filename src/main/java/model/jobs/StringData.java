package model.jobs;

public class StringData {
    public String jobsId = "";  // Primary key
    public String serviceType = "";  // Descriptive field
    public String jobDay = "";  // Date field
    public String totalCost = "";  // Total cost of the job (decimal)
    public String imageUrl = "";  // Image URL
    public String errorMsg = "";  // Not in the database, used to convey success/failure.
    public String webUserId = "";  // Foreign key (links to web_user table)
    public String userEmail = "";

    public StringData() {
    }

    public int characterCount() {
        String s = this.jobsId + this.serviceType + this.jobDay +
                this.totalCost + this.imageUrl + this.webUserId;
        return s.length();
    }
}