package com.example.crud.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Digits;
import java.math.BigDecimal;

public class ItemRequest {

    @NotBlank(message = "名稱不可為空白")
    @Size(min = 1, max = 100, message = "名稱長度必須介於 1 到 100 字元之間")
    private String name;

    @Size(max = 500, message = "描述長度不可超過 500 字元")
    private String description;

    @DecimalMin(value = "0.0", inclusive = true, message = "價格不可小於 0")
    @DecimalMax(value = "999999.99", inclusive = true, message = "價格不可超過 999999.99")
    @Digits(integer = 6, fraction = 2, message = "價格格式錯誤：整數最多 6 位，小數最多 2 位")
    private BigDecimal price;

    public ItemRequest() {
    }

    public ItemRequest(String name, String description, BigDecimal price) {
        this.name = name;
        this.description = description;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}