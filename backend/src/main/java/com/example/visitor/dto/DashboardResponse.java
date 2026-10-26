package com.example.visitor.dto;

import java.util.List;

/**
 * DashboardResponse aggregates key operational metrics for the Security Guard console.
 */
public class DashboardResponse {

    private long currentlyInsideCount;
    private long todayVisitsCount;
    private long todayCheckOutCount;
    private long todayDeliveriesCount;
    private List<VisitResponse> recentVisits;

    public DashboardResponse() {
    }

    public DashboardResponse(long currentlyInsideCount, long todayVisitsCount, long todayCheckOutCount, long todayDeliveriesCount, List<VisitResponse> recentVisits) {
        this.currentlyInsideCount = currentlyInsideCount;
        this.todayVisitsCount = todayVisitsCount;
        this.todayCheckOutCount = todayCheckOutCount;
        this.todayDeliveriesCount = todayDeliveriesCount;
        this.recentVisits = recentVisits;
    }

    public long getCurrentlyInsideCount() {
        return currentlyInsideCount;
    }

    public void setCurrentlyInsideCount(long currentlyInsideCount) {
        this.currentlyInsideCount = currentlyInsideCount;
    }

    public long getTodayVisitsCount() {
        return todayVisitsCount;
    }

    public void setTodayVisitsCount(long todayVisitsCount) {
        this.todayVisitsCount = todayVisitsCount;
    }

    public long getTodayCheckOutCount() {
        return todayCheckOutCount;
    }

    public void setTodayCheckOutCount(long todayCheckOutCount) {
        this.todayCheckOutCount = todayCheckOutCount;
    }

    public long getTodayDeliveriesCount() {
        return todayDeliveriesCount;
    }

    public void setTodayDeliveriesCount(long todayDeliveriesCount) {
        this.todayDeliveriesCount = todayDeliveriesCount;
    }

    public List<VisitResponse> getRecentVisits() {
        return recentVisits;
    }

    public void setRecentVisits(List<VisitResponse> recentVisits) {
        this.recentVisits = recentVisits;
    }
}
